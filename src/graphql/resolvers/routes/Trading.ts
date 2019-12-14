import { Resolver } from '~/graphql';
import { Trading, OpenMakeOrder, HubRoutes, Accounting, ERC20WithFields } from '@melonproject/melonjs';

export const address: Resolver<[HubRoutes, Trading]> = ([, trading]) => trading.contract.address;

export const openMakeOrders: Resolver<[HubRoutes, Trading]> = async ([, trading], _, context) => {
  const openMakeOrders = await trading.getOpenMakeOrders(context.block);

  const orders = Promise.all(
    openMakeOrders.map(async (order: OpenMakeOrder) => {
      const details = await trading.getOrderDetails(order.orderIndex, context.block);
      return { ...order, ...details };
    })
  );

  return orders;
};

export const lockedAssets: Resolver<[HubRoutes, Trading]> = async ([routes, trading], _, context) => {
  if (!routes.accounting) {
    return false;
  }

  const accounting = new Accounting(context.environment, routes.accounting);
  const assets = await accounting.getOwnedAssets(context.block);

  const balances = await Promise.all(
    assets.map(address => {
      const instance = new ERC20WithFields(context.environment, address);
      return instance.getBalanceOf(trading.contract.address, context.block);
    })
  );

  return !!balances.find(balance => !balance.isZero());
};
