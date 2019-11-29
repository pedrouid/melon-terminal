import { Resolver } from '~/graphql';
import { Participation } from '@melonproject/melonjs';

enum InvestmentRequestState {
  VALID = 'VALID',
  EXPIRED = 'EXPIRED',
  WAITING = 'WAITING',
  NONE = 'NONE',
}

export const address: Resolver<[Participation, string]> = ([participation, _]) => participation.contract.address;

export const hasInvested: Resolver<[Participation, string]> = ([participation, account], _, context) => {
  return participation.hasInvested(account, context.block);
};

export const hasRequest: Resolver<[Participation, string]> = ([participation, account], _, context) => {
  return participation.hasRequest(account, context.block);
};

export const hasValidRequest: Resolver<[Participation, string]> = ([participation, account], _, context) => {
  return participation.hasValidRequest(account, context.block);
};

export const hasExpiredRequest: Resolver<[Participation, string]> = ([participation, account], _, context) => {
  return participation.hasExpiredRequest(account, context.block);
};

export const investmentRequestState: Resolver<[Participation, string]> = async (
  [participation, account],
  _,
  context
) => {
  const hasValidRequest = await participation.hasValidRequest(account, context.block);
  if (hasValidRequest) {
    return InvestmentRequestState.VALID;
  }

  const hasRequest = await participation.hasRequest(account, context.block);
  if (hasRequest) {
    return InvestmentRequestState.WAITING;
  }

  const hasExpiredRequest = await participation.hasExpiredRequest(account, context.block);
  if (hasRequest && hasExpiredRequest) {
    return InvestmentRequestState.EXPIRED;
  }

  return InvestmentRequestState.NONE;
};

export const request: Resolver<[Participation, string]> = ([participation, account], _, context) => {
  return participation.getRequest(account, context.block);
};

export const canCancelRequest: Resolver<[Participation, string]> = ([participation, account], _, context) => {
  return participation.canCancelRequest(account, context.block);
};
