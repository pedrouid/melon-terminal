import React from 'react';
import BigNumber from 'bignumber.js';
import * as Yup from 'yup';
import useForm, { FormContext } from 'react-hook-form';
import { Participation } from '@melonproject/melonjs';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useFundInvestQuery } from '~/queries/FundInvest';
import { useTransaction } from '~/hooks/useTransaction';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { Spinner } from '~/storybook/components/Spinner/Spinner';
import { useAccount } from '~/hooks/useAccount';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';
import { FormField } from '~/storybook/components/FormField/FormField';
import { Input } from '~/storybook/components/Input/Input';
import { Button } from '~/storybook/components/Button/Button';
import { Block } from '~/storybook/components/Block/Block';
import { SectionTitle } from '~/storybook/components/Title/Title';
import {
  CheckboxContainer,
  CheckboxInput,
  CheckboxMask,
  CheckboxIcon,
  CheckboxLabel,
} from '~/storybook/components/Checkbox/Checkbox';

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
      <Block>
        <SectionTitle>Redeem</SectionTitle>
        <Spinner />
      </Block>
    );
  }

  return (
    <Block>
      <SectionTitle>Redeem</SectionTitle>
      {hasInvested && shares && (
        <>
          <p>You own {shares?.balanceOf?.toString()} shares!</p>
          <FormContext {...form}>
            <form onSubmit={submit}>
              <FormField name="shareQuantity" label="Number of shares to redeem">
                <Input
                  id="shareQuantity"
                  name="shareQuantity"
                  type="number"
                  step="any"
                  min="0"
                  max={shares?.balanceOf?.toString()}
                  disabled={redeemAll}
                />
              </FormField>
              <CheckboxContainer>
                <CheckboxInput
                  type="checkbox"
                  ref={form.register}
                  name="redeemAll"
                  id="redeemAll"
                  onClick={handleRedeemAllClick}
                />
                <CheckboxMask>
                  <CheckboxIcon></CheckboxIcon>
                </CheckboxMask>
                <CheckboxLabel htmlFor="redeemAll">Redeem all shares</CheckboxLabel>
              </CheckboxContainer>
              <Button type="submit">Redeem</Button>
            </form>
          </FormContext>
          <TransactionModal transaction={transaction} />
        </>
      )}
      {(!hasInvested || shares?.balanceOf?.isZero() || !shares?.balanceOf) && <p>You don't own any shares.</p>}
    </Block>
  );
};
