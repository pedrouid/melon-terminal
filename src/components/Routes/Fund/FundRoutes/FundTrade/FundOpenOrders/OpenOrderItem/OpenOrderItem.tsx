import React from 'react';
import BigNumber from 'bignumber.js';
import { useEnvironment } from '~/hooks/useEnvironment';
import { OpenMakeOrder } from '~/queries/FundOpenMakeOrders';
import { useTransaction } from '~/hooks/useTransaction';
import {
  Hub,
  Trading,
  OasisDexTradingAdapter,
  ZeroExTradingAdapter,
  MatchingMarket,
  ExchangeIdentifier,
} from '@melonproject/melonjs';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { BodyCell, BodyCellRightAlign, BodyRow } from '~/storybook/components/Table/Table';
import { useAccount } from '~/hooks/useAccount';
import { Button } from '~/storybook/components/Button/Button';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';

export interface OpenOrderItemProps {
  address: string;
  order: OpenMakeOrder;
  manager: boolean;
}

export const OpenOrderItem: React.FC<OpenOrderItemProps> = ({ address, order, manager }) => {
  const environment = useEnvironment()!;
  const account = useAccount();

  const makerAsset = environment.getToken(order.makerAsset);
  const takerAsset = environment.getToken(order.takerAsset);
  const makerAmount = order.makerQuantity.dividedBy(new BigNumber(10).exponentiatedBy(makerAsset?.decimals ?? 'NaN'));
  const takerAmount = order.takerQuantity.dividedBy(new BigNumber(10).exponentiatedBy(takerAsset?.decimals ?? 'NaN'));
  const price = takerAmount.dividedBy(makerAmount);
  const exchange = environment.getExchange(order.exchange);
  const refetch = useOnChainQueryRefetcher();
  const transaction = useTransaction(environment, {
    onFinish: (receipt) => refetch(receipt.blockNumber),
  });

  const submit = async () => {
    const hub = new Hub(environment, address);
    const trading = new Trading(environment, (await hub.getRoutes()).trading);

    if (exchange && exchange.id === ExchangeIdentifier.OasisDex) {
      const oasisDex = await OasisDexTradingAdapter.create(trading, exchange.exchange);

      const matchingMarket = new MatchingMarket(environment, exchange.exchange);
      const offer = await matchingMarket.getOffer(order.id);

      if (await matchingMarket.isActive(order.id)) {
        const tx = oasisDex.cancelOrder(account.address!, order.id, offer);
        return transaction.start(tx, 'Cancel order');
      }

      const tx = trading.sendUpdateAndGetQuantityBeingTraded(account.address!, order.makerAsset);
      return transaction.start(tx, 'Update and get quantity being traded');
    }

    if (exchange && exchange.id === ExchangeIdentifier.ZeroEx) {
      const zeroEx = await ZeroExTradingAdapter.create(trading, order.exchange);
      const args = {
        orderId: order.id,
      };

      const tx = await zeroEx.cancelOrder(account.address!, args);
      return transaction.start(tx, 'Cancel order');
    }
  };

  return (
    <BodyRow>
      <BodyCell>{makerAsset?.symbol ?? order.makerAsset}</BodyCell>
      <BodyCell>{takerAsset?.symbol ?? order.takerAsset}</BodyCell>
      <BodyCell>{exchange?.name ?? order.exchange}</BodyCell>
      <BodyCellRightAlign>
        <FormattedNumber value={price} decimals={6} />
      </BodyCellRightAlign>
      <BodyCellRightAlign>
        <FormattedNumber value={makerAmount} decimals={6} />
      </BodyCellRightAlign>
      {manager && (
        <BodyCell>
          <Button type="submit" onClick={() => submit()}>
            Cancel
          </Button>
          <TransactionModal transaction={transaction} />
        </BodyCell>
      )}
    </BodyRow>
  );
};

export default OpenOrderItem;
