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

export interface RequestInvestmentProps {
  address: string;
  totalSupply?: BigNumber;
  allowedAssets?: AllowedInvestmentAsset[];
  account: Account;
  loading: boolean;
}

interface RequestInvestmentFormValues {
  investmentAsset?: string;
  investmentAmount: number;
  requestedShares: number;
}

const validationSchema = Yup.object().shape({
  investmentAmount: Yup.number()
    .required()
    .positive(),
  requestedShares: Yup.number()
    .required()
    .positive(),
  investmentAsset: Yup.string(),
});

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

  const form = useForm<RequestInvestmentFormValues>({
    validationSchema,
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: {
      requestedShares: 1,
      investmentAsset: initialAsset?.token?.address,
      investmentAmount: initialAsset?.shareCostInAsset
        ?.dividedBy(new BigNumber(10).exponentiatedBy(initialAsset?.token?.decimals || 18))
        .multipliedBy(multiplier)
        .decimalPlaces(initialAsset?.token?.decimals || 18)
        .toNumber(),
    },
  });

  const investmentAsset = form.watch('investmentAsset') as string | undefined;
  const investmentAmount = form.watch('investmentAmount') as number;
  const requestedShares = form.watch('requestedShares') as number;
  const token = (investmentAsset && environment.getToken(investmentAsset)) as TokenDefinition | undefined;
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
    onFinish: () => refetch(),
    onAcknowledge: () => {
      const values = form.getValues();
      if (action === 'invest') {
        const contract = new Participation(environment, participation);
        const sharesAmount = new BigNumber(values.requestedShares).times(new BigNumber(10).exponentiatedBy(18));
        const investmentAmount = new BigNumber(values.investmentAmount).times(
          new BigNumber(10).exponentiatedBy(token!.decimals)
        );
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
        const amount = new BigNumber(values.investmentAmount).times(new BigNumber(10).exponentiatedBy(token!.decimals));
        const tx = contract.approve(account.address!, participation!, amount);
        transaction.start(tx, 'Approve');
        break;
      }

      case 'invest': {
        const contract = new Participation(environment, participation);
        const sharesAmount = new BigNumber(values.requestedShares).times(new BigNumber(10).exponentiatedBy(18));
        const investmentAmount = new BigNumber(values.investmentAmount).times(
          new BigNumber(10).exponentiatedBy(token!.decimals)
        );
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
    if (asset && token && requestedShares) {
      const shares = new BigNumber(event.target.value ?? 0)
        .multipliedBy(new BigNumber(10).exponentiatedBy(token.decimals))
        .dividedBy(asset.shareCostInAsset!)
        .dividedBy(multiplier);

      form.setValue('requestedShares', shares.isNaN() ? 0 : shares.toNumber());
    }
  };

  const handleRequestedSharesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (asset && token) {
      const amount = new BigNumber(event.target.value ?? 0)
        .multipliedBy(asset.shareCostInAsset!)
        .dividedBy(new BigNumber(10).exponentiatedBy(token.decimals))
        .multipliedBy(multiplier);

      form.setValue('investmentAmount', amount.isNaN() ? 0 : parseFloat(amount.toFixed(token.decimals || 18)));
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

          {(query.loading && <Spinner />) || (
            <>
              <div>
                Your balance: {allowance?.balance?.toString() ?? 'N/A'} {asset?.token?.symbol}
              </div>

              <FormField name="requestedShares" label="Number of shares">
                <Input
                  id="requestedShares"
                  name="requestedShares"
                  type="number"
                  step="any"
                  min="0"
                  disabled={props.loading}
                  onChange={handleRequestedSharesChange}
                />
              </FormField>

              <FormField name="sharePrice" label={`Share price in ${asset?.token?.symbol}`}>
                <Input
                  id="sharePrice"
                  name="sharePrice"
                  type="number"
                  step="any"
                  min="0"
                  value={
                    asset &&
                    asset.shareCostInAsset &&
                    asset?.shareCostInAsset
                      .dividedBy(new BigNumber(10).exponentiatedBy(asset?.token?.decimals || 18))
                      .multipliedBy(multiplier)
                      .toString()
                  }
                  disabled={true}
                />
              </FormField>

              <FormField name="investmentAmount" label={`Max investment amount in ${asset?.token?.symbol}`}>
                <Input
                  id="investmentAmount"
                  name="investmentAmount"
                  type="number"
                  step="any"
                  min="0"
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
