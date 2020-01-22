import React from 'react';
import * as Yup from 'yup';
import BigNumber from 'bignumber.js';
import { useForm,  FormContext } from 'react-hook-form';
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
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import * as S from './WalletWrapEther.styles';
import { toTokenBaseUnit } from '~/utils/toTokenBaseUnit';
import { fromTokenBaseUnit } from '~/utils/fromTokenBaseUnit';

export const WalletWrapEther: React.FC = () => {
  const environment = useEnvironment()!;
  const account = useAccount();
  const refetch = useOnChainQueryRefetcher();
  const transaction = useTransaction(environment!, {
    onFinish: receipt => refetch(receipt.blockNumber),
  });

  const validationSchema = Yup.object().shape({
    quantityEth: Yup.mixed<BigNumber>()
      .transform((value, _) => new BigNumber(value))
      .test('positive', 'Amount of ETH has to be positive', (value: BigNumber) => value.isGreaterThan(0))
      .test('balance', 'Not enough ETH in wallet', (value: BigNumber) => !!account.eth?.isGreaterThanOrEqualTo(value)),
  });

  const defaultValues = {
    quantityEth: account.eth?.isLessThan(new BigNumber(1)) ? account.eth : new BigNumber(1),
  };

  const form = useForm<typeof defaultValues>({
    defaultValues,
    validationSchema,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const submit = form.handleSubmit(async data => {
    const token = environment.getToken('WETH')!;
    const weth = new Weth(environment, token.address);
    const tx = weth.deposit(account.address!, toTokenBaseUnit(data.quantityEth, 18));
    transaction.start(tx, 'Wrap Ether');
  });

  return (
    <Block>
      <Title>Wrap Ether</Title>
      <FormContext {...form}>
        <form onSubmit={submit}>
          <S.WalletWrapEtherBalances>
            <S.WalletWrapEtherBalance>
              <FormattedNumber value={fromTokenBaseUnit(account.eth!, 18)} suffix="ETH" />
            </S.WalletWrapEtherBalance>
            <S.WalletWrapEtherBalance>
              <FormattedNumber value={fromTokenBaseUnit(account.weth!, 18)} suffix="WETH" />
            </S.WalletWrapEtherBalance>
          </S.WalletWrapEtherBalances>
          <FormField name="quantityEth" label="Quantity">
            <Input id="quantityEth" name="quantityEth" type="number" step="any" />
          </FormField>
          <BlockActions>
            <Button type="submit" disabled={!!form.errors.quantityEth}>
              Wrap Ether
            </Button>
          </BlockActions>
        </form>
      </FormContext>

      <TransactionModal transaction={transaction} />
    </Block>
  );
};

export default WalletWrapEther;
