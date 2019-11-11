import * as S from './WrapEtherForm.styles';
import React from 'react';
import { useAccountBalancesQuery } from '~/queries/AccountBalances';
import { FieldValues } from 'react-hook-form/dist/types';
import { InputField } from './InputField/InputField';
import { SubmitButton } from './SubmitButton/SubmitButton';

export interface WrapEtherFormValues extends FieldValues {
  quantity: number;
}

export interface WrapEtherFormProps {
  submit: (event: React.BaseSyntheticEvent) => Promise<void>;
  form: any;
  label: string;
}

export const WrapEtherForm: React.FC<WrapEtherFormProps> = props => {
  const [balances] = useAccountBalancesQuery();

  return (
    <S.WrapEtherForm onSubmit={props.submit}>
      <S.WrapEtherFormBalances>
        <S.WrapEtherFormBalance>{balances && balances.eth.toFixed(4)} ETH</S.WrapEtherFormBalance>
        <S.WrapEtherFormBalance>{balances && balances.weth.toFixed(4)} WETH</S.WrapEtherFormBalance>
      </S.WrapEtherFormBalances>
      <InputField id="quantity" name="quantity" label="Quantity" type="number" step="any" />
      <SubmitButton label={`${props.label} Ether`} />
    </S.WrapEtherForm>
  );
};
