import React from 'react';
import * as Yup from 'yup';
import BigNumber from 'bignumber.js';
import useForm, { FormContext } from 'react-hook-form';
import { toWei } from 'web3-utils';
import { Weth } from '@melonproject/melonjs';
import { useTransaction } from '~/hooks/useTransaction';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useAccount } from '~/hooks/useAccount';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';
import { Block, BlockActions } from '~/storybook/components/Block/Block';
import { Title } from '~/storybook/components/Title/Title';
import { FormField } from '~/storybook/components/FormField/FormField';
import { Input } from '~/storybook/components/Input/Input';
import { Button } from '~/storybook/components/Button/Button';
import * as S from './WalletWrapEther.styles';

const validationSchema = Yup.object().shape({
  quantity: Yup.mixed<number>(),
});

const defaultValues = {
  quantity: '0.5',
};

export const WalletWrapEther: React.FC = () => {
  const environment = useEnvironment()!;
  const account = useAccount();
  const refetch = useOnChainQueryRefetcher();
  const transaction = useTransaction(environment!, {
    onFinish: () => refetch(),
  });

  const form = useForm<typeof defaultValues>({
    defaultValues,
    validationSchema,
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  const submit = form.handleSubmit(async data => {
    const token = environment.getToken('WETH')!;
    const weth = new Weth(environment, token.address);
    const tx = weth.deposit(new BigNumber(toWei(data.quantity)), account.address!);
    transaction.start(tx, 'Wrap Ether');
  });

  return (
    <Block>
      <Title>Wrap Ether</Title>
      <FormContext {...form}>
        <form onSubmit={submit}>
          <S.WalletWrapEtherBalances>
            <S.WalletWrapEtherBalance>{account.eth?.toFixed(4)} ETH</S.WalletWrapEtherBalance>
            <S.WalletWrapEtherBalance>{account.weth?.toFixed(4)} WETH</S.WalletWrapEtherBalance>
          </S.WalletWrapEtherBalances>

          <FormField name="quantity" label="Quantity">
            <Input id="quantity" name="quantity" type="number" step="any" />
          </FormField>

          <BlockActions>
            <Button type="submit">Wrap Ether</Button>
          </BlockActions>
        </form>
      </FormContext>

      <TransactionModal transaction={transaction} />
    </Block>
  );
};

export default WalletWrapEther;
