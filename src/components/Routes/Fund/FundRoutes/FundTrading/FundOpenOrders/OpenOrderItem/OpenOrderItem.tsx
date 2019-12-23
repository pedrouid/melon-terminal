import React, { useMemo } from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import { findToken } from '~/utils/findToken';
import { OpenMakeOrder } from '~/queries/FundOpenMakeOrders';
import BigNumber from 'bignumber.js';
import { useTransaction } from '~/hooks/useTransaction';
import { Hub, Trading, OasisDexTradingAdapter, ZeroExTradingAdapter, MatchingMarket } from '@melonproject/melonjs';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { findExchange } from '~/utils/findExchange';
import { BodyCell, BodyCellRightAlign, BodyRow } from '~/components/Common/Table/Table.styles';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';

export interface OpenOrderItemProps {
  address: string;
  order: OpenMakeOrder;
  refresh: () => Promise<void>;
}

export const OpenOrderItem: React.FC<OpenOrderItemProps> = ({ address, order, refresh }) => {
  const environment = useEnvironment()!;

  const exchange = useMemo(() => findExchange(environment.deployment, order.exchange), [order.exchange]);
  const makerToken = useMemo(() => findToken(environment.deployment, order.makerAsset)!, [order.makerAsset]);
  const takerToken = useMemo(() => findToken(environment.deployment, order.takerAsset)!, [order.takerAsset]);
  const makerAmount = useMemo(() => order.makerQuantity.dividedBy(new BigNumber(10).exponentiatedBy(makerToken.decimals)), [order.makerQuantity, makerToken.decimals]);
  const takerAmount = useMemo(() => order.takerQuantity.dividedBy(new BigNumber(10).exponentiatedBy(takerToken.decimals)), [order.takerQuantity, takerToken.decimals]);
  const price = useMemo(() => takerAmount.dividedBy(makerAmount), [takerAmount, makerAmount]);

  const transaction = useTransaction(environment, {
    onFinish: refresh,
  });

  const submit = async () => {
    const hub = new Hub(environment, address);
    const trading = new Trading(environment, (await hub.getRoutes()).trading);

    if (exchange?.name === 'MatchingMarket') {
      const adapter = await OasisDexTradingAdapter.create(trading, exchange.exchange);
      const market = new MatchingMarket(environment, exchange.exchange);

      if (await market.isActive(order.id)) {
        const offer = await market.getOffer(order.id);
        const tx = adapter.cancelOrder(environment.account!, {
          id: order.id,
          makerAsset: offer.makerAsset,
          takerAsset: order.takerAsset,
        });

        return transaction.start(tx, 'Cancel order on OasisDex');
      }

      const tx = trading.sendUpdateAndGetQuantityBeingTraded(environment.account!, order.makerAsset);
      return transaction.start(tx, 'Update and get quantity being traded');
    }

    if (exchange?.name === 'ZeroEx') {
      const adapter = await ZeroExTradingAdapter.create(trading, order.exchange);
      const tx = await adapter.cancelOrder(environment.account!, {
        orderId: order.id,
      });

      return transaction.start(tx, 'Cancel order on 0x');
    }
  };

  return (
    <BodyRow>
      <BodyCell>{makerToken.symbol}</BodyCell>
      <BodyCell>{exchange?.name}</BodyCell>
      <BodyCellRightAlign>{price.toFixed(6)}</BodyCellRightAlign>
      <BodyCellRightAlign>{makerAmount.toFixed(6)}</BodyCellRightAlign>
      <BodyCell>
        <SubmitButton label="Cancel" onClick={submit} />
        <TransactionModal transaction={transaction} />
      </BodyCell>
    </BodyRow>
  );
};

export default OpenOrderItem;
