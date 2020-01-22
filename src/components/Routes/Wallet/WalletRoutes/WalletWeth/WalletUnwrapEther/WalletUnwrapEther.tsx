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
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import { Button } from '~/storybook/components/Button/Button';
import * as S from './WalletUnwrapEther.styles';
import { toTokenBaseUnit } from '~/utils/toTokenBaseUnit';
import { fromTokenBaseUnit } from '~/utils/fromTokenBaseUnit';

export const WalletUnwrapEther: React.FC = () => {
  const environment = useEnvironment()!;
  const account = useAccount();
  const refetch = useOnChainQueryRefetcher();
  const transaction = useTransaction(environment!, {
    onFinish: receipt => refetch(receipt.blockNumber),
  });

  const validationSchema = Yup.object().shape({
    quantityWeth: Yup.mixed<BigNumber>()
      .transform((value, _) => new BigNumber(value))
      .test('positive', 'Amount of WETH has to be positive', (value: BigNumber) => value.isGreaterThan(0))
      .test(
        'balance',
        'Not enough WETH in wallet',
        (value: BigNumber) => !!account.weth?.isGreaterThanOrEqualTo(toTokenBaseUnit(value, 18))
      ),
  });

  const defaultValues = {
    quantityWeth: account.weth?.isLessThan(new BigNumber('1e18'))
      ? fromTokenBaseUnit(account.weth, 18)
      : new BigNumber(1),
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
    const tx = weth.withdraw(account.address!, toTokenBaseUnit(data.quantityWeth, 18));
    transaction.start(tx, 'Unwrap Ether');
  });

  return (
    <Block>
      <Title>Unwrap Ether</Title>
      <FormContext {...form}>
        <form onSubmit={submit}>
          <S.WalletUnwrapEtherBalances>
            <S.WalletUnwrapEtherBalance>
              <FormattedNumber value={fromTokenBaseUnit(account.eth!, 18)} suffix="ETH" />
            </S.WalletUnwrapEtherBalance>
            <S.WalletUnwrapEtherBalance>
              <FormattedNumber value={fromTokenBaseUnit(account.weth!, 18)} suffix="WETH" />
            </S.WalletUnwrapEtherBalance>
          </S.WalletUnwrapEtherBalances>

          <FormField name="quantityWeth" label="Quantity">
            <Input id="quantityWeth" name="quantityWeth" />
          </FormField>
          <BlockActions>
            <Button type="submit" disabled={!!form.errors.quantityWeth}>
              Unwrap Ether
            </Button>
          </BlockActions>
        </form>
      </FormContext>

      <TransactionModal transaction={transaction} />
    </Block>
  );
};

export default WalletUnwrapEther;
