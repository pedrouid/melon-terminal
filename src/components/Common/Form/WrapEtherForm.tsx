import * as S from './WrapEtherForm.styles';
import React from 'react';
import { useAccountBalancesQuery } from '~/queries/AccountBalances';
import { FieldValues } from 'react-hook-form/dist/types';

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
      <S.WrapEtherInput>
        <S.WrapEtherInputLabel>Quantity</S.WrapEtherInputLabel>
        {props.form.errors.quantity && <div>{props.form.errors.quantity.message}</div>}
        <S.WrapEtherInputField type="number" step="any" name="quantity" ref={props.form.register} />
      </S.WrapEtherInput>
      <S.WrapEtherButton type="submit">{props.label} Ether</S.WrapEtherButton>
    </S.WrapEtherForm>
  );
};
