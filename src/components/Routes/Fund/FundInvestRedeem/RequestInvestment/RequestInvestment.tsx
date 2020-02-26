import React, { forwardRef, useImperativeHandle, useEffect, useMemo, useState } from 'react';
import { useForm, FormContext } from 'react-hook-form';
import * as Yup from 'yup';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useAccount } from '~/hooks/useAccount';
import { TransactionHookValues, TransactionFormValues } from '~/hooks/useTransaction';
import {
  Transaction,
  TokenDefinition,
  sameAddress,
  StandardToken,
  Participation,
  Environment,
} from '@melonproject/melonjs';
import { AllowedInvestmentAsset, Account } from '@melonproject/melongql';
import { fromTokenBaseUnit } from '~/utils/fromTokenBaseUnit';
import { useAccountAllowanceQuery } from '~/components/Routes/Fund/FundInvestRedeem/RequestInvestment/AccountAllowance.query';
import { toTokenBaseUnit } from '~/utils/toTokenBaseUnit';
import { Input } from '~/storybook/components/Input/Input';
import { BlockActions } from '~/storybook/components/Block/Block';
import { Button } from '~/storybook/components/Button/Button';
import { Dropdown } from '~/storybook/components/Dropdown/Dropdown';
import { Spinner } from '~/storybook/components/Spinner/Spinner';
import { NotificationBar, NotificationContent } from '~/storybook/components/NotificationBar/NotificationBar';
import { Link } from '~/storybook/components/Link/Link';
import BigNumber from 'bignumber.js';
import { TransactionRef } from '../FundInvest/FundInvest';
import { AccountContextValue } from '~/components/Contexts/Account/Account';
import { TokenValue } from '~/components/Common/TokenValue/TokenValue';
import { useInvestorTotalExposureQuery } from './InvestorTotalExposure.query';
import { useCoinAPI } from '~/hooks/useCoinAPI';
import {
  CheckboxContainer,
  CheckboxInput,
  CheckboxMask,
  CheckboxIcon,
  CheckboxLabel,
} from '~/storybook/components/Checkbox/Checkbox';

export interface RequestInvestmentProps {
  address: string;
  totalSupply?: BigNumber;
  allowedAssets?: AllowedInvestmentAsset[];
  account: Account;
  loading: boolean;
  transaction: TransactionHookValues<TransactionFormValues>;
}

interface RequestInvestmentFormValues {
  investmentAsset?: string;
  investmentAmount: BigNumber;
  requestedShares: BigNumber;
  acknowledgeLimit: boolean;
}

export const RequestInvestment = forwardRef(
  (props: RequestInvestmentProps, ref: React.Ref<TransactionRef | undefined>) => {
    const environment = useEnvironment()!;
    const account = useAccount();
    const [formValues, setFormValues] = useState<RequestInvestmentFormValues>();
    const daiRate = useCoinAPI();

    const allowedAssets = props.allowedAssets || [];
    const initialAsset = allowedAssets[0];
    const totalSupply = props.totalSupply;
    const multiplier = useMemo(() => {
      return totalSupply?.isZero() ? new BigNumber(1) : new BigNumber(1.1);
    }, [totalSupply]);

    const validationSchema = Yup.object().shape({
      investmentAmount: Yup.mixed<BigNumber>()
        .transform((value, _) => new BigNumber(value).decimalPlaces(initialAsset?.token?.decimals || 18))
        .test('positive', 'Investment amount has to be positive', (value: BigNumber) => value.isGreaterThan(0)),
      requestedShares: Yup.mixed<BigNumber>()
        .transform((value, _) => new BigNumber(value))
        .test('positive', 'Number of shares has to be positive', (value: BigNumber) => value.isGreaterThan(0)),
      investmentAsset: Yup.string(),
      acknowledgeLimit: Yup.boolean(),
    });

    const defaultValues = {
      requestedShares: new BigNumber(1),
      investmentAsset: initialAsset?.token?.address,
      investmentAmount: fromTokenBaseUnit(initialAsset!.shareCostInAsset!, initialAsset!.token!.decimals!)
        .multipliedBy(multiplier)
        .decimalPlaces(initialAsset?.token?.decimals || 18),
    };

    const form = useForm<RequestInvestmentFormValues>({
      defaultValues,
      validationSchema,
      mode: 'onSubmit',
      reValidateMode: 'onBlur',
    });

    const investmentAsset = form.watch('investmentAsset') as string;
    const investmentAmount = form.watch('investmentAmount') as BigNumber;
    const token = (investmentAsset && environment.getToken(investmentAsset)) as TokenDefinition;
    const asset = allowedAssets.find(allowedAsset => sameAddress(allowedAsset.token?.address, investmentAsset));
    const participation = props.account?.participation?.address;
    const [allowance, query] = useAccountAllowanceQuery(account.address, investmentAsset, participation);

    const [currentWethExposure] = useInvestorTotalExposureQuery(account.address);
    const tokenRate = useCoinAPI({ base: asset?.token?.symbol });
    const currentDaiExposure = currentWethExposure?.multipliedBy(daiRate.data.rate) || new BigNumber(0);
    const additionalDaiExposure = new BigNumber(investmentAmount)
      .multipliedBy(tokenRate.data.rate)
      .multipliedBy('1e18');
    const totalDaiExposure = currentDaiExposure.plus(additionalDaiExposure);

    const councilExposureLimit = parseInt(process.env.MELON_MAX_EXPOSURE, 10);
    const needsAcknowledgement = totalDaiExposure.isGreaterThanOrEqualTo(
      new BigNumber(councilExposureLimit).multipliedBy('1e18')
    );
    const acknowledged = form.watch('acknowledgeLimit') as boolean;

    useEffect(() => {
      if (allowance?.balance.isLessThan(toTokenBaseUnit(investmentAmount, token!.decimals))) {
        form.setError(
          'investmentAmount',
          'tooLow',
          `Your ${asset?.token?.symbol} balance is too low for this investment amount`
        );
      } else {
        form.clearError('investmentAmount');
      }
    }, [allowance, investmentAmount]);

    useEffect(() => {
      const values = form.getValues();
      if (asset && token) {
        const amount = new BigNumber(values.requestedShares ?? 0)
          .multipliedBy(fromTokenBaseUnit(asset.shareCostInAsset!, token.decimals))
          .multipliedBy(multiplier);

        form.setValue(
          'investmentAmount',
          amount.isNaN() ? new BigNumber(0) : amount.decimalPlaces(asset!.token!.decimals!)
        );
      }
    }, [asset, multiplier]);

    const action = useMemo(() => {
      if (allowance?.allowance.isGreaterThanOrEqualTo(toTokenBaseUnit(investmentAmount, token!.decimals))) {
        return 'invest';
      }
      return 'approve';
    }, [allowance, investmentAmount]);

    const approveAmount = (
      environment: Environment,
      account: AccountContextValue,
      token: TokenDefinition,
      amount: BigNumber
    ) => {
      const contract = new StandardToken(environment, token.address);
      const approvalAmount = toTokenBaseUnit(amount, token!.decimals);
      const tx = contract.approve(account.address!, participation!, approvalAmount);
      props.transaction.start(tx, 'Approve');
    };

    const investAmount = (
      environment: Environment,
      account: AccountContextValue,
      token: TokenDefinition,
      amount: BigNumber,
      shares: BigNumber
    ) => {
      const contract = new Participation(environment, participation);
      const sharesAmount = toTokenBaseUnit(shares, 18);
      const investmentAmount = toTokenBaseUnit(amount, token.decimals);
      const tx = contract.requestInvestment(account.address!, sharesAmount, investmentAmount, token.address);
      props.transaction.start(tx, 'Invest');
    };

    useImperativeHandle(ref, () => ({
      next: (start: (transaction: Transaction, name: string) => void) => {
        if (action === 'invest' && formValues) {
          investAmount(environment, account, token, formValues.investmentAmount, formValues.requestedShares);
        }
      },
    }));

    const submit = form.handleSubmit(async values => {
      switch (action) {
        case 'approve': {
          setFormValues({
            investmentAsset: values.investmentAsset!,
            investmentAmount: values.investmentAmount,
            requestedShares: values.requestedShares,
            acknowledgeLimit: values.acknowledgeLimit,
          });
          approveAmount(environment, account, token, values.investmentAmount);
          break;
        }

        case 'invest': {
          investAmount(environment, account, token, values.investmentAmount, values.requestedShares);
          break;
        }
      }
    });

    const handleInvestmentAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (asset && token) {
        const shares = toTokenBaseUnit(event.target.value, token.decimals)
          .dividedBy(asset.shareCostInAsset!)
          .dividedBy(multiplier);

        form.setValue('requestedShares', shares.isNaN() ? new BigNumber(0) : shares);
      }
    };

    const handleRequestedSharesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (asset && token) {
        const amount = new BigNumber(event.target.value ?? 0)
          .multipliedBy(fromTokenBaseUnit(asset.shareCostInAsset!, token.decimals))
          .multipliedBy(multiplier);

        form.setValue(
          'investmentAmount',
          amount.isNaN() ? new BigNumber(0) : amount.decimalPlaces(asset!.token!.decimals!)
        );
      }
    };

    const investmentAssetOptions = (props.allowedAssets ?? []).map(holding => ({
      value: holding.token!.address!,
      name: holding.token!.symbol!,
    }));

    return (
      <>
        <FormContext {...form}>
          <form onSubmit={submit}>
            <Dropdown
              name="investmentAsset"
              label="Investment asset"
              id="investmentAsset"
              options={investmentAssetOptions}
              disabled={props.loading}
            />

            {(query.loading && !asset && <Spinner />) || (
              <>
                <NotificationBar kind="neutral">
                  <NotificationContent>
                    Your balance:{' '}
                    <TokenValue
                      value={allowance?.balance}
                      decimals={asset!.token!.decimals!}
                      symbol={asset?.token?.symbol}
                    />
                  </NotificationContent>
                </NotificationBar>

                {asset?.token?.symbol === 'WETH' && (
                  <NotificationBar kind="neutral">
                    <NotificationContent>
                      Get WETH by wrapping your ether in the <Link to="/wallet/weth">wallet section</Link>.
                    </NotificationContent>
                  </NotificationBar>
                )}

                <Input
                  id="requestedShares"
                  name="requestedShares"
                  label="Number of shares"
                  disabled={props.loading}
                  onChange={handleRequestedSharesChange}
                />

                <Input
                  id="sharePrice"
                  name="sharePrice"
                  label={`Share price in ${asset?.token?.symbol}`}
                  value={fromTokenBaseUnit(asset!.shareCostInAsset!, asset!.token!.decimals!)
                    .multipliedBy(multiplier)
                    .toFixed(asset?.token?.decimals!)}
                  disabled={true}
                />

                <Input
                  id="investmentAmount"
                  name="investmentAmount"
                  label={`Total investment amount in ${asset?.token?.symbol}`}
                  disabled={props.loading}
                  onChange={handleInvestmentAmountChange}
                />

                {needsAcknowledgement && (
                  <>
                    <NotificationBar kind="error">
                      <NotificationContent>
                        After this investment, your maximum exposure to Melon funds will exceed the current limit set by
                        the Melon Council (DAI 50k).
                      </NotificationContent>
                    </NotificationBar>
                    <CheckboxContainer>
                      <CheckboxInput
                        type="checkbox"
                        ref={form.register}
                        name="acknowledgeLimit"
                        id="acknowledgeLimit"
                      />
                      <CheckboxMask>
                        <CheckboxIcon />
                      </CheckboxMask>
                      <CheckboxLabel htmlFor="acknowledgeLimit">
                        I acknowledge that I am aware of the risks associated with having a large exposure to Melon
                        funds.
                      </CheckboxLabel>
                    </CheckboxContainer>
                  </>
                )}

                <BlockActions>
                  <Button
                    type="submit"
                    disabled={
                      props.loading || !!form.errors.investmentAmount || (needsAcknowledgement && !acknowledged)
                    }
                  >
                    Invest
                  </Button>
                </BlockActions>
              </>
            )}
          </form>
        </FormContext>
      </>
    );
  }
);
