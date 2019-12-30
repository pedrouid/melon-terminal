import React from 'react';
import * as Yup from 'yup';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useFundInvestQuery } from '~/queries/FundInvest';
import useForm, { FormContext } from 'react-hook-form';
import { Participation } from '@melonproject/melonjs';
import { useTransaction } from '~/hooks/useTransaction';
import BigNumber from 'bignumber.js';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { InputField } from '~/components/Common/Form/InputField/InputField';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';
import { useFundDetailsQuery } from '~/queries/FundDetails';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import { useAccount } from '~/hooks/useAccount';
import * as S from './FundRedeem.styles';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';

export interface FundRedeemProps {
  address: string;
}

const validationSchema = Yup.object().shape({
  shareQuantity: Yup.number()
    .required()
    .positive(),
  redeemAll: Yup.boolean(),
});

const defaultValues = {
  shareQuantity: 1,
  redeemAll: false,
};

export const FundRedeem: React.FC<FundRedeemProps> = ({ address }) => {
  const environment = useEnvironment()!;
  const account = useAccount();
  const refetch = useOnChainQueryRefetcher();
  const [result, query] = useFundInvestQuery(address);

  const participationAddress = result?.account?.participation?.address;
  const hasInvested = result?.account?.participation?.hasInvested;
  const shares = result?.account?.shares;

  const participationContract = new Participation(environment, participationAddress);

  const transaction = useTransaction(environment, {
    onFinish: () => refetch(),
  });

  const form = useForm<typeof defaultValues>({
    defaultValues,
    validationSchema,
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  const redeemAll = form.watch('redeemAll') as boolean;

  const submit = form.handleSubmit(async data => {
    if (redeemAll) {
      const tx = participationContract.redeem(account.address!);
      transaction.start(tx, 'Redeem all shares');
      return;
    }

    const shareQuantity = new BigNumber(data.shareQuantity).times(new BigNumber(10).exponentiatedBy(18));
    const tx = participationContract.redeemQuantity(account.address!, shareQuantity);
    transaction.start(tx, 'Redeem shares');
  });

  const handleRedeemAllClick = () => {
    shares && shares.balanceOf && form.setValue('shareQuantity', shares!.balanceOf!.toNumber());
  };

  if (query.loading) {
    return (
      <S.Wrapper>
        <S.Title>Redeem</S.Title>
        <Spinner />
      </S.Wrapper>
    );
  }

  return (
    <S.Wrapper>
      <S.Title>Redeem</S.Title>
      {hasInvested && shares && (
        <>
          <p>You own {shares?.balanceOf?.toString()} shares!</p>
          <FormContext {...form}>
            <form onSubmit={submit}>
              <InputField
                id="shareQuantity"
                name="shareQuantity"
                label="Number of shares to redeem"
                type="number"
                step="any"
                min="0"
                max={shares?.balanceOf?.toString()}
                disabled={redeemAll}
              />

              <input
                type="checkbox"
                ref={form.register}
                name="redeemAll"
                id="redeemAll"
                onClick={handleRedeemAllClick}
              />
              <label htmlFor="redeemAll">Redeem all shares</label>

              <SubmitButton label="Redeem" id="action" />
            </form>
          </FormContext>
          <TransactionModal transaction={transaction} />
        </>
      )}
      {(!hasInvested || shares?.balanceOf?.isZero() || !shares?.balanceOf) && <p>You don't own any shares.</p>}
    </S.Wrapper>
  );
};
