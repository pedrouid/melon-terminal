import React from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import { OpenMakeOrder } from '~/queries/FundOpenMakeOrders';
import BigNumber from 'bignumber.js';
import { useTransaction } from '~/hooks/useTransaction';
import {
  Hub,
  Trading,
  OasisDexTradingAdapter,
  ZeroExTradingAdapter,
  MatchingMarket,
  findExchange,
  findToken,
} from '@melonproject/melonjs';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { BodyCell, BodyCellRightAlign, BodyRow } from '~/components/Common/Table/Table.styles';
import { useAccount } from '~/hooks/useAccount';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';

export interface OpenOrderItemProps {
  address: string;
  order: OpenMakeOrder;
}

export const OpenOrderItem: React.FC<OpenOrderItemProps> = ({ address, order }) => {
  const environment = useEnvironment()!;
  const account = useAccount();

  const makerSymbol = findToken(environment.deployment, order.makerAsset)!;
  const takerSymbol = findToken(environment.deployment, order.takerAsset)!;

  const makerAmount = order.makerQuantity.dividedBy(new BigNumber(10).exponentiatedBy(makerSymbol.decimals));
  const takerAmount = order.takerQuantity.dividedBy(new BigNumber(10).exponentiatedBy(takerSymbol.decimals));

  const expired = order.expiresAt < new Date();
  const price = takerAmount.dividedBy(makerAmount);
  const exchange = findExchange(environment.deployment, order.exchange);
  const refetch = useOnChainQueryRefetcher();
  const transaction = useTransaction(environment, {
    onFinish: () => refetch(),
  });

  const submit = async () => {
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

        const tx = oasisDex.cancelOrder(account.address!, args);
        transaction.start(tx, 'Cancel order');
      } else {
        const tx = trading.sendUpdateAndGetQuantityBeingTraded(account.address!, order.makerAsset);
        transaction.start(tx, 'Update and get quantity being traded');
      }
    } else {
      const zeroEx = await ZeroExTradingAdapter.create(trading, order.exchange);

      const args = {
        orderId: order.id,
      };
      const tx = await zeroEx.cancelOrder(account.address!, args);
      transaction.start(tx, 'Cancel order');
    }
  };

  return (
    <BodyRow>
      <BodyCell>{makerSymbol && makerSymbol.symbol}</BodyCell>
      <BodyCell>{exchange && exchange.name}</BodyCell>
      <BodyCellRightAlign>{price.toFixed(6)}</BodyCellRightAlign>
      <BodyCellRightAlign>{makerAmount.toFixed(6)}</BodyCellRightAlign>
      <BodyCell>
        {expired && <SubmitButton type="button" label="Cancel" onClick={() => submit()} />}
        <TransactionModal transaction={transaction} />
      </BodyCell>
    </BodyRow>
  );
};

export default OpenOrderItem;
