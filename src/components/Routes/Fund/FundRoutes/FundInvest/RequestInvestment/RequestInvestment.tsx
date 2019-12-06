import React, { useState, useMemo, useEffect } from 'react';
import * as S from './RequestInvestment.styles';
import BigNumber from 'bignumber.js';

import * as Yup from 'yup';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useTransaction } from '~/hooks/useTransaction';
import useForm, { FormContext } from 'react-hook-form';
import { Participation, StandardToken, Hub } from '@melonproject/melonjs';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { InputField } from '~/components/Common/Form/InputField/InputField';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';
import { useAccountAllowanceQuery } from '~/queries/AccountAllowance';
import {
  AccountParticipation,
  AccountShares,
  FundInvestHolding,
  FundInvestQueryResult,
  FundInvestQueryVariables,
} from '~/queries/FundInvest';
import { QueryResult } from '@apollo/react-common';

export interface RequestInvestmentProps {
  address: string;
  holdings?: FundInvestHolding[];
  account: {
    participation: AccountParticipation;
    shares: AccountShares;
  };
  fundQuery: QueryResult<FundInvestQueryResult, FundInvestQueryVariables>;
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

const defaultValues = {
  investmentAmount: 1,
  requestedShares: 1,
  investmentAsset: '',
};

export const RequestInvestment: React.FC<RequestInvestmentProps> = props => {
  const environment = useEnvironment()!;

  const [selectedTokenIndex, setSelectedTokenIndex] = useState(0);

  const [allowance, allowanceQuery] = useAccountAllowanceQuery(
    props.holdings && props.holdings[selectedTokenIndex].token.address,
    props.account && props.account.participation.address
  );

  const transaction = useTransaction(environment, {
    onAcknowledge: () => {
      allowanceQuery.refetch();
      props.fundQuery.refetch();
    },
  });

  const participationAddress = props.account && props.account.participation && props.account.participation.address;
  const participationContract = new Participation(environment, participationAddress);

  const form = useForm<typeof defaultValues>({
    defaultValues,
    validationSchema,
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  const investmentAsset = form.watch('investmentAsset') as string;
  const investmentAmount = form.watch('investmentAmount') as number;
  const requestedShares = form.watch('requestedShares') as number;

  const action = useMemo(() => {
    if (allowance && allowance.allowance.isGreaterThanOrEqualTo(investmentAmount)) {
      return 'invest';
    }

    return 'approve';
  }, [allowance, investmentAmount]);

  useEffect(() => {
    props.holdings && form.setValue('investmentAsset', props.holdings[selectedTokenIndex].token.address);

    const calculatedInvestmentAmount =
      props.holdings &&
      new BigNumber(requestedShares)
        .multipliedBy(props.holdings[selectedTokenIndex].shareCostInAsset)
        .dividedBy(new BigNumber(10).exponentiatedBy(props.holdings![selectedTokenIndex].token.decimals));
    form.setValue('investmentAmount', (calculatedInvestmentAmount && calculatedInvestmentAmount!.toNumber()) || 1);
  }, [selectedTokenIndex]);

  const submit = form.handleSubmit(data => {
    const investmentToken = new StandardToken(environment, data.investmentAsset);

    switch (action) {
      case 'approve': {
        const tx = investmentToken.approve(
          environment.account!,
          props.account.participation.address,
          new BigNumber(data.investmentAmount).times(
            new BigNumber(10).exponentiatedBy(props.holdings![selectedTokenIndex].token.decimals)
          )
        );
        transaction.start(tx);
        break;
      }
      case 'invest': {
        const tx = participationContract.requestInvestment(
          environment.account!,
          new BigNumber(data.requestedShares).times(new BigNumber(10).exponentiatedBy(18)),
          new BigNumber(data.investmentAmount).times(
            new BigNumber(10).exponentiatedBy(props.holdings![selectedTokenIndex].token.decimals)
          ),
          data.investmentAsset
        );
        transaction.start(tx);
        break;
      }
    }
  });

  const handleTokenChange = (e: any) => {
    const index = props.holdings && props.holdings.map(token => token.token.address).indexOf(e.target.value);
    setSelectedTokenIndex(index || 0);
  };

  const handleRequestedSharesChange = (e: any) => {
    const token = props.holdings && props.holdings.find(token => token.token.address === investmentAsset);
    const calculatedInvestmentAmount =
      token &&
      new BigNumber(requestedShares)
        .multipliedBy(token.shareCostInAsset)
        .dividedBy(new BigNumber(10).exponentiatedBy(token.token.decimals));
    form.setValue('investmentAmount', (calculatedInvestmentAmount && calculatedInvestmentAmount!.toNumber()) || 1);
  };

  const handleInvestmentAmountChange = (e: any) => {
    const token = props.holdings && props.holdings.find(token => token.token.address === investmentAsset);
    const calculatedRequestedShares =
      token &&
      new BigNumber(investmentAmount)
        .multipliedBy(new BigNumber(10).exponentiatedBy(token.token.decimals))
        .dividedBy(token.shareCostInAsset);
    form.setValue('requestedShares', (calculatedRequestedShares && calculatedRequestedShares!.toNumber()) || 1);
  };

  const currentBalance =
    allowance &&
    allowance.balance
      // .times(new BigNumber(10).exponentiatedBy(props.holdings![selectedTokenIndex].token.decimals))
      .toString();
  const currentAllowance =
    allowance &&
    allowance.allowance
      // .times(new BigNumber(10).exponentiatedBy(props.holdings![selectedTokenIndex].token.decimals))
      .toString();

  return (
    <>
      <FormContext {...form}>
        <S.RequestInvestmentForm onSubmit={submit}>
          <S.DropDownWrapper>
            <S.Select ref={form.register} name="investmentAsset" id="investmentAsset" onChange={handleTokenChange}>
              {props.holdings &&
                props.holdings.map(holding => {
                  return (
                    <option value={holding.token.address!} key={holding.token.address}>
                      {holding.token.symbol}
                    </option>
                  );
                })}
            </S.Select>
          </S.DropDownWrapper>
          Your current balance: {currentBalance} - your current allowance: {currentAllowance}
          <InputField
            id="requestedShares"
            name="requestedShares"
            label="Number of shares"
            type="number"
            step="any"
            min="0"
            onChange={handleRequestedSharesChange}
          />
          <InputField
            id="investmentAmount"
            name="investmentAmount"
            label="Investment Amount"
            type="number"
            step="any"
            min="0"
            onChange={handleInvestmentAmountChange}
          />
          <SubmitButton label={action} id="action" />
        </S.RequestInvestmentForm>
      </FormContext>
      <TransactionModal transaction={transaction} title={action} />
    </>
  );
};

export default RequestInvestment;
