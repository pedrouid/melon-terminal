import React from 'react';
import * as S from './OpenOrderItem.styles';
import { useEnvironment } from '~/hooks/useEnvironment';
import { findToken } from '~/utils/findToken';
import { OpenMakeOrder } from '~/queries/FundOpenMakeOrders';
import BigNumber from 'bignumber.js';
import { useTransaction } from '~/hooks/useTransaction';
import useForm, { FormContext } from 'react-hook-form';
import { Hub, Trading } from '@melonproject/melonjs';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';

export interface OpenOrderItemProps {
  address: string;
  order: OpenMakeOrder;
}

export const OpenOrderItem: React.FC<OpenOrderItemProps> = ({ address, order }) => {
  const environment = useEnvironment()!;

  const makerSymbol = findToken(environment.deployment, order.makerAsset)!;
  const takerSymbol = findToken(environment.deployment, order.takerAsset)!;

  const makerAmount = order.makerQuantity.dividedBy(new BigNumber(10).exponentiatedBy(makerSymbol.decimals));
  const takerAmount = order.takerQuantity.dividedBy(new BigNumber(10).exponentiatedBy(takerSymbol.decimals));

  const expired = order.expiresAt < new Date();
  const price = takerAmount.dividedBy(makerAmount);

  const transaction = useTransaction(environment, {});

  const form = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  const submit = form.handleSubmit(async data => {
    // const hub = new Hub(environment, address);
    // const trading = new Trading(environment, (await hub.getRoutes()).trading);
    // const tx = trading.callOnExchange(environment.account!, order.exchange, order.makerAsset);
    // transaction.start(tx);
  });

  return (
    <FormContext {...form}>
      <S.BodyRow>
        <S.BodyCell>{makerSymbol && makerSymbol.symbol}</S.BodyCell>
        <S.BodyCell></S.BodyCell>
        <S.BodyCellRightAlign>{price.toFixed(6)}</S.BodyCellRightAlign>
        <S.BodyCellRightAlign>{makerAmount.toFixed(6)}</S.BodyCellRightAlign>
        <S.BodyCell>
          <form onSubmit={submit}>
            <input type="submit" hidden={!expired} value="Remove" />
          </form>
          <TransactionModal transaction={transaction} title="Remove order" />
        </S.BodyCell>
      </S.BodyRow>
    </FormContext>
  );
};

export default OpenOrderItem;
