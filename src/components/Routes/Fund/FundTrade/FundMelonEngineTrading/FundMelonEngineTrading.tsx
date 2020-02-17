import React from 'react';
import BigNumber from 'bignumber.js';
import { ExchangeDefinition, Hub, MelonEngineTradingAdapter, TokenDefinition, Trading } from '@melonproject/melonjs';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Button } from '~/storybook/components/Button/Button';
import { useTransaction } from '~/hooks/useTransaction';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { useMelonEngineTradingQuery } from './FundMelonEngineTrading.query';
import { Holding } from '@melonproject/melongql';
import { toTokenBaseUnit } from '~/utils/toTokenBaseUnit';
import { useAccount } from '~/hooks/useAccount';
import { Subtitle } from '~/storybook/components/Title/Title';

export interface FundMelonEngineTradingProps {
  trading: string;
  exchange: ExchangeDefinition;
  holdings: Holding[];
  maker: TokenDefinition;
  taker: TokenDefinition;
  quantity: BigNumber;
  active: boolean;
}

export const FundMelonEngineTrading: React.FC<FundMelonEngineTradingProps> = props => {
  const [price, liquid, query] = useMelonEngineTradingQuery();
  const environment = useEnvironment()!;
  const account = useAccount()!;
  const refetch = useOnChainQueryRefetcher();
  const transaction = useTransaction(environment);

  const value = props.quantity.multipliedBy(price ?? new BigNumber('NaN'));
  const valid = !value.isNaN() && value.isLessThanOrEqualTo(liquid.dividedBy('1e18'));
  const ready = !query.loading && valid;

  const submit = async () => {
    const trading = new Trading(environment, props.trading);
    const adapter = await MelonEngineTradingAdapter.create(environment, props.exchange.exchange, trading);
    const tx = adapter.takeOrder(account.address!, {
      makerAsset: props.maker.address,
      takerAsset: props.taker.address,
      makerQuantity: toTokenBaseUnit(value, props.maker.decimals),
      takerQuantity: toTokenBaseUnit(props.quantity, props.taker.decimals),
    });

    transaction.start(tx, 'Take order');
  };

  return (
    <>
      <Subtitle>Melon engine</Subtitle>
      <Button type="button" disabled={!ready || !props.active} loading={ready} onClick={submit}>
        {ready ? '' : valid ? `Buy ${value.toFixed(4)} ${props.maker.symbol}` : 'No offer'}
      </Button>
      <TransactionModal transaction={transaction} />
    </>
  );
};
