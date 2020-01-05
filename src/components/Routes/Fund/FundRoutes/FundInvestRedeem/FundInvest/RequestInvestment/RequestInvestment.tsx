import React, { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import * as Yup from 'yup';
import useForm, { FormContext } from 'react-hook-form';
import { Participation, StandardToken, sameAddress, TokenDefinition } from '@melonproject/melonjs';
import { Holding, Account } from '@melonproject/melongql';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useTransaction } from '~/hooks/useTransaction';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { useAccountAllowanceQuery } from '~/queries/AccountAllowance';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';
import { useAccount } from '~/hooks/useAccount';
import { FormField } from '~/storybook/components/FormField/FormField';
import { Input } from '~/storybook/components/Input/Input';
import { Button } from '~/storybook/components/Button/Button';
import { Dropdown } from '~/storybook/components/Dropdown/Dropdown';
import { Spinner } from '~/components/Common/Spinner/Spinner';

export interface RequestInvestmentProps {
  address: string;
  holdings?: Holding[];
  account: Account;
  loading: boolean;
}

interface RequestInvestmentFormValues {
  investmentAsset: string | undefined;
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

  const transaction = useTransaction(environment, {
    onFinish: () => refetch(),
  });

  const holdings = props.holdings ?? [];
  const form = useForm<RequestInvestmentFormValues>({
    validationSchema,
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: {
      investmentAsset: holdings[0]?.token?.address,
      investmentAmount: 1,
      requestedShares: 1,
    },
  });

  const investmentAsset = form.watch('investmentAsset') as string | undefined;
  const investmentAmount = form.watch('investmentAmount') as number;
  const requestedShares = form.watch('requestedShares') as number;
  const token = (investmentAsset && environment.getToken(investmentAsset)) as TokenDefinition | undefined;
  const holding = holdings.find(holding => sameAddress(holding.token?.address, investmentAsset));
  const participation = props.account?.participation?.address;
  const [allowance, query] = useAccountAllowanceQuery(account.address, investmentAsset, participation);

  const action = useMemo(() => {
    if (allowance?.allowance.isGreaterThanOrEqualTo(investmentAmount)) {
      return 'invest';
    }

    return 'approve';
  }, [allowance, investmentAmount]);

  const submit = form.handleSubmit(values => {
    switch (action) {
      case 'approve': {
        const contract = new StandardToken(environment, values.investmentAsset);
        const tx = contract.approve(
          account.address!,
          participation!,
          new BigNumber(values.investmentAmount).times(new BigNumber(10).exponentiatedBy(token!.decimals))
        );

        transaction.start(tx, 'Approve');
        break;
      }

      case 'invest': {
        const contract = new Participation(environment, participation);
        const tx = contract.requestInvestment(
          account.address!,
          new BigNumber(values.requestedShares).times(new BigNumber(10).exponentiatedBy(18)),
          new BigNumber(values.investmentAmount).times(new BigNumber(10).exponentiatedBy(token!.decimals)),
          values.investmentAsset!
        );

        transaction.start(tx, 'Invest');
        break;
      }
    }
  });

  const handleInvestmentAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const shares = (holding &&
      token &&
      requestedShares &&
      new BigNumber(event.target.value ?? 0)
        .multipliedBy(new BigNumber(10).exponentiatedBy(token.decimals))
        .dividedBy(holding.shareCostInAsset!)) as BigNumber;

    form.setValue('requestedShares', shares?.toNumber() ?? 1);
  };

  const handleRequestedSharesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const amount = (holding &&
      token &&
      new BigNumber(event.target.value ?? 0)
        .multipliedBy(holding.shareCostInAsset!)
        .dividedBy(new BigNumber(10).exponentiatedBy(token.decimals))) as BigNumber;

    form.setValue('investmentAmount', amount?.toNumber() ?? 1);
  };

  const investmentAssetOptions = (props.holdings ?? []).map(holding => ({
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
              <div>Your current balance: {allowance?.balance?.toString() ?? 'N/A'}</div>
              <div>Your current allowance: {allowance?.allowance?.toString() ?? 'N/A'}</div>

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

              <FormField name="investmentAmount" label="Investment Amount">
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

              <Button type="submit" disabled={props.loading}>
                {action}
              </Button>
            </>
          )}
        </form>
      </FormContext>

      <TransactionModal transaction={transaction} />
    </>
  );
};

export default RequestInvestment;
