import React from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import { findToken } from '~/utils/findToken';
import { OpenMakeOrder } from '~/queries/FundOpenMakeOrders';
import BigNumber from 'bignumber.js';
import { useTransaction } from '~/hooks/useTransaction';
import useForm, { FormContext } from 'react-hook-form';
import { Hub, Trading, OasisDexTradingAdapter, ZeroExTradingAdapter, MatchingMarket } from '@melonproject/melonjs';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { findExchange } from '~/utils/findExchange';
import { BodyCell, BodyCellRightAlign, BodyRow } from '~/components/Common/Table/Table.styles';

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

  const exchange = findExchange(environment.deployment, order.exchange);

  const transaction = useTransaction(environment, {});

  const form = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  const submit = form.handleSubmit(async data => {
    const hub = new Hub(environment, address);
    const trading = new Trading(environment, (await hub.getRoutes()).trading);

    if (exchange && exchange.name === 'MatchingMarket') {
      const oasisDex = await OasisDexTradingAdapter.create(trading, exchange.exchange);

      const matchingMarket = new MatchingMarket(environment, exchange.exchange);
      const offer = await matchingMarket.getOffer(order.id);

      const isActive = await matchingMarket.isActive(order.id);
      if (isActive) {
        const args = {
          id: order.id,
          makerAsset: offer.makerAsset,
          takerAsset: order.takerAsset,
        };

        const tx = oasisDex.cancelOrder(environment.account!, args);
        transaction.start(tx, 'Cancel order on OasisDex');
      } else {
        const tx = trading.sendUpdateAndGetQuantityBeingTraded(environment.account!, order.makerAsset);
        transaction.start(tx, 'Update and get quantity being traded');
      }
    } else {
      const zeroEx = await ZeroExTradingAdapter.create(trading, order.exchange);

      const args = {
        orderId: order.id,
      };
      const tx = await zeroEx.cancelOrder(environment.account!, args);
      transaction.start(tx, 'Cancel order on 0x');
    }
  });

  return (
    <FormContext {...form}>
      <BodyRow>
        <BodyCell>{makerSymbol && makerSymbol.symbol}</BodyCell>
        <BodyCell>{exchange && exchange.name}</BodyCell>
        <BodyCellRightAlign>{price.toFixed(6)}</BodyCellRightAlign>
        <BodyCellRightAlign>{makerAmount.toFixed(6)}</BodyCellRightAlign>
        <BodyCell>
          <form onSubmit={submit}>
            <input type="submit" hidden={!expired} value="Cancel" />
          </form>
          <TransactionModal transaction={transaction} />
        </BodyCell>
      </BodyRow>
    </FormContext>
  );
};

export default OpenOrderItem;
