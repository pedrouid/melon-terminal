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
import { GridRow, GridCol } from '~/storybook/components/Grid/Grid';
import { Title } from '~/storybook/components/Title/Title';

export interface FundMelonEngineTradingProps {
  address: string;
  exchange: ExchangeDefinition;
  holdings: Holding[];
  maker: TokenDefinition;
  taker: TokenDefinition;
  quantity: BigNumber;
}

export const FundMelonEngineTrading: React.FC<FundMelonEngineTradingProps> = props => {
  const [price, liquid, query] = useMelonEngineTradingQuery();
  const environment = useEnvironment()!;
  const account = useAccount()!;
  const refetch = useOnChainQueryRefetcher();
  const transaction = useTransaction(environment, {
    onFinish: receipt => refetch(receipt.blockNumber),
  });

  if (!(props.maker.symbol === 'WETH' && props.taker.symbol === 'MLN')) {
    return null;
  }

  const mln = environment.getToken('MLN');
  const weth = environment.getToken('WETH');
  const value = props.quantity.multipliedBy(price ?? new BigNumber('NaN'));
  const loading = query.loading;

  const submit = async () => {
    const hub = new Hub(environment, props.address);
    const trading = new Trading(environment, (await hub.getRoutes()).trading);
    const adapter = await MelonEngineTradingAdapter.create(environment, props.exchange.exchange, trading);
    const tx = adapter.takeOrder(account.address!, {
      makerAsset: weth.address,
      takerAsset: mln.address,
      makerQuantity: toTokenBaseUnit(value, weth.decimals),
      takerQuantity: toTokenBaseUnit(props.quantity, mln.decimals),
    });

    transaction.start(tx, 'Take order');
  };

  return (
    <>
      <GridRow>
        <GridCol>
          <Title>Melon engine</Title>
          <Button
            type="button"
            disabled={loading || value.isNaN() || value.isLessThanOrEqualTo(liquid.dividedBy('1e18'))}
            loading={loading}
            onClick={submit}
          >
            Buy{' '}
            {!loading && !value.isNaN() && !value.isLessThanOrEqualTo(liquid.dividedBy('1e18')) ? value.toFixed(4) : ''}{' '}
            WETH
          </Button>
        </GridCol>
      </GridRow>
      <TransactionModal transaction={transaction} />
    </>
  );
};
