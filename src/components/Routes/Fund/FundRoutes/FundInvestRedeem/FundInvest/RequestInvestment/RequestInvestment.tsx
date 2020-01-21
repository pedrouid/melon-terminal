import React, { useMemo, useEffect } from 'react';
import BigNumber from 'bignumber.js';
import * as Yup from 'yup';
import useForm, { FormContext } from 'react-hook-form';
import { Participation, StandardToken, sameAddress, TokenDefinition } from '@melonproject/melonjs';
import { AllowedInvestmentAsset, Account } from '@melonproject/melongql';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useTransaction } from '~/hooks/useTransaction';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { useAccountAllowanceQuery } from '~/queries/AccountAllowance';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';
import { useAccount } from '~/hooks/useAccount';
import { FormField } from '~/storybook/components/FormField/FormField';
import { Input } from '~/storybook/components/Input/Input';
import { BlockActions } from '~/storybook/components/Block/Block';
import { Button } from '~/storybook/components/Button/Button';
import { Dropdown } from '~/storybook/components/Dropdown/Dropdown';
import { Spinner } from '~/storybook/components/Spinner/Spinner';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import { NotificationBar } from '~/storybook/components/NotificationBar/NotificationBar';
import { Link } from '~/storybook/components/Link/Link';
import { toTokenBaseUnit } from '~/utils/toTokenBaseUnit';
import { fromTokenBaseUnit } from '~/utils/fromTokenBaseUnit';

export interface RequestInvestmentProps {
  address: string;
  totalSupply?: BigNumber;
  allowedAssets?: AllowedInvestmentAsset[];
  account: Account;
  loading: boolean;
}

interface RequestInvestmentFormValues {
  investmentAsset?: string;
  investmentAmount: BigNumber;
  requestedShares: BigNumber;
}

export const RequestInvestment: React.FC<RequestInvestmentProps> = props => {
  const environment = useEnvironment()!;
  const account = useAccount();
  const refetch = useOnChainQueryRefetcher();

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

  const action = useMemo(() => {
    if (allowance?.allowance.isGreaterThanOrEqualTo(investmentAmount)) {
      return 'invest';
    }
    return 'approve';
  }, [allowance, investmentAmount]);

  useEffect(() => {
    if (allowance?.balance.isLessThan(investmentAmount)) {
      form.setError(
        'investmentAmount',
        'tooLow',
        `Your ${asset?.token?.symbol} balance is too low for this investment amount`
      );
    } else {
      form.clearError('investmentAmount');
    }
  }, [allowance, investmentAmount]);

  const transaction = useTransaction(environment, {
    onFinish: receipt => refetch(receipt.blockNumber),
    onAcknowledge: () => {
      const values = form.getValues();
      if (action === 'invest') {
        const contract = new Participation(environment, participation);
        const sharesAmount = toTokenBaseUnit(values.requestedShares, 18);
        const investmentAmount = toTokenBaseUnit(values.investmentAmount, token!.decimals);
        const tx = contract.requestInvestment(
          account.address!,
          sharesAmount,
          investmentAmount,
          values.investmentAsset!
        );
        transaction.start(tx, 'Invest');
      }
    },
  });

  const submit = form.handleSubmit(values => {
    switch (action) {
      case 'approve': {
        const contract = new StandardToken(environment, values.investmentAsset);
        const amount = toTokenBaseUnit(values.investmentAmount, token!.decimals);
        const tx = contract.approve(account.address!, participation!, amount);
        transaction.start(tx, 'Approve');
        break;
      }

      case 'invest': {
        const contract = new Participation(environment, participation);
        const sharesAmount = toTokenBaseUnit(values.requestedShares, 18);
        const investmentAmount = toTokenBaseUnit(values.investmentAmount, token!.decimals);
        const tx = contract.requestInvestment(
          account.address!,
          sharesAmount,
          investmentAmount,
          values.investmentAsset!
        );
        transaction.start(tx, 'Invest');
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
          <FormField name="investmentAsset" label="Investment asset">
            <Dropdown
              name="investmentAsset"
              id="investmentAsset"
              options={investmentAssetOptions}
              disabled={props.loading}
            />
          </FormField>

          {(query.loading && !asset && <Spinner />) || (
            <>
              <div>
                Your balance:{' '}
                <FormattedNumber
                  value={fromTokenBaseUnit(allowance?.balance, asset!.token!.decimals!)}
                  suffix={asset?.token?.symbol}
                />
              </div>

              {asset?.token?.symbol === 'WETH' && (
                <NotificationBar kind="neutral">
                  Get WETH by wrapping your ether in the <Link to="/wallet/weth">wallet section</Link>.
                </NotificationBar>
              )}

              <FormField name="requestedShares" label="Number of shares">
                <Input
                  id="requestedShares"
                  name="requestedShares"
                  disabled={props.loading}
                  onChange={handleRequestedSharesChange}
                />
              </FormField>

              <FormField name="sharePrice" label={`Share price in ${asset?.token?.symbol}`}>
                <Input
                  id="sharePrice"
                  name="sharePrice"
                  value={fromTokenBaseUnit(asset!.shareCostInAsset!, asset!.token!.decimals!)
                    .multipliedBy(multiplier)
                    .toFixed(asset?.token?.decimals!)}
                  disabled={true}
                />
              </FormField>

              <FormField name="investmentAmount" label={`Total investment amount in ${asset?.token?.symbol}`}>
                <Input
                  id="investmentAmount"
                  name="investmentAmount"
                  disabled={props.loading}
                  onChange={handleInvestmentAmountChange}
                />
              </FormField>
              <BlockActions>
                <Button type="submit" disabled={props.loading || !!form.errors.investmentAmount}>
                  Invest
                </Button>
              </BlockActions>
            </>
          )}
        </form>
      </FormContext>

      <TransactionModal transaction={transaction} />
    </>
  );
};

export default RequestInvestment;
