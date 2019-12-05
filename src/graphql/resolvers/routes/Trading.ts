import { Resolver } from '~/graphql';
import { Trading, OpenMakeOrder } from '@melonproject/melonjs';

export const address: Resolver<Trading> = trading => trading.contract.address;

export const openMakeOrders: Resolver<Trading> = async (trading, _, context) => {
  const openMakeOrders = await trading.getOpenMakeOrders(context.block);

  const orders = Promise.all(
    openMakeOrders.map(async (order: OpenMakeOrder) => {
      const details = await trading.getOrderDetails(order.orderIndex, context.block);
      return { ...order, ...details };
    })
  );

  return orders;
};
