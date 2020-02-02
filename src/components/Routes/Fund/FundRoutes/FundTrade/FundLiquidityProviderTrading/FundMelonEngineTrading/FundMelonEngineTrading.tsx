import React from 'react';
import BigNumber from 'bignumber.js';
import { ExchangeDefinition, Hub, MelonEngineTradingAdapter, TokenDefinition, Trading } from '@melonproject/melonjs';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Input } from '~/storybook/components/Input/Input';
import { Button } from '~/storybook/components/Button/Button';
import { useTransaction } from '~/hooks/useTransaction';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { useMelonEngineTradingQuery } from './FundMelonEngineTrading.query';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import { BlockActions, Block } from '~/storybook/components/Block/Block';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { Holding } from '@melonproject/melongql';
import { toTokenBaseUnit } from '~/utils/toTokenBaseUnit';
import { useAccount } from '~/hooks/useAccount';

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
    <Block>
      <SectionTitle>Melon engine</SectionTitle>
      <Input
        type="text"
        label="Buy quantity"
        value={
          !loading && !value.isNaN() && value.isLessThanOrEqualTo(liquid.dividedBy('1e18')) ? value.toFixed(4) : ''
        }
        disabled={true}
      />

      {!loading && (
        <>
          <div>
            Rate: <FormattedNumber value="1" suffix="MLN" /> = <FormattedNumber value={price} suffix="WETH" />
          </div>

          <div>
            Liquid ether: <FormattedNumber value={liquid.dividedBy('1e18')} suffix="WETH" />
          </div>
        </>
      )}

      <BlockActions>
        <Button type="button" disabled={loading} loading={loading} onClick={submit}>
          Submit
        </Button>
      </BlockActions>

      <TransactionModal transaction={transaction} />
    </Block>
  );
};
