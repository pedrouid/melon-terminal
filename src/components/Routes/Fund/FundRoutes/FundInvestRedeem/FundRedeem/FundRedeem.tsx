import React, { useEffect } from 'react';
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
import { Block, BlockActions } from '~/storybook/components/Block/Block';
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

  const validationSchema = Yup.object().shape({
    shareQuantity: Yup.mixed<BigNumber>()
      .transform((value, _) => new BigNumber(value))
      .test('positive', 'Number of shares has to be positive', (value: BigNumber) => !!value?.isGreaterThan(0))
      .test(
        'smallerThanBalance',
        'Number of shares has to be equal or less than number of shares owned',
        (value: BigNumber) => !!(shares?.balanceOf && value?.isLessThanOrEqualTo(shares?.balanceOf))
      ),

    redeemAll: Yup.boolean(),
  });

  const defaultValues = {
    shareQuantity: new BigNumber(1),
    redeemAll: false,
  };

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

    const shareQuantity = data.shareQuantity.times(new BigNumber('1e18'));
    const tx = participationContract.redeemQuantity(account.address!, shareQuantity);
    transaction.start(tx, 'Redeem shares');
  });

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
      {hasInvested && shares && !shares?.balanceOf?.isZero() && (
        <>
          <p>You own {shares?.balanceOf?.toFixed(18)} shares</p>
          <FormContext {...form}>
            <form onSubmit={submit}>
              <div hidden={redeemAll}>
                <FormField name="shareQuantity" label="Number of shares to redeem">
                  <Input
                    id="shareQuantity"
                    name="shareQuantity"
                    type="number"
                    step="any"
                    min="0"
                    max={shares?.balanceOf?.toString()}
                  />
                </FormField>
              </div>
              <CheckboxContainer>
                <CheckboxInput type="checkbox" ref={form.register} name="redeemAll" id="redeemAll" />
                <CheckboxMask>
                  <CheckboxIcon />
                </CheckboxMask>
                <CheckboxLabel htmlFor="redeemAll">Redeem all shares</CheckboxLabel>
              </CheckboxContainer>
              <BlockActions>
                <Button type="submit">Redeem</Button>
              </BlockActions>
            </form>
          </FormContext>
          <TransactionModal transaction={transaction} />
        </>
      )}
      {(!hasInvested || shares?.balanceOf?.isZero() || !shares?.balanceOf) && <p>You don't own any shares.</p>}
    </Block>
  );
};
