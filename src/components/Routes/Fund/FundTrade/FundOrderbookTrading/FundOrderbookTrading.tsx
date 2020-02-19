import React, { useState, useEffect } from 'react';
import { ExchangeDefinition } from '@melonproject/melonjs';
import { Holding } from '@melonproject/melongql';
import { FundOrderbook } from '../FundOrderbook/FundOrderbook';
import { OrderbookItem } from '../FundOrderbook/utils/aggregatedOrderbook';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Dropdown } from '~/storybook/components/Dropdown/Dropdown';
import { FundOrderbookMarketForm } from '../FundOrderbookMarketForm/FundOrderbookMarketForm';
import { Block } from '~/storybook/components/Block/Block';
import { SectionTitle } from '~/storybook/components/Title/Title';
import * as S from './FundOrderbookTrading.styles';

export interface FundOrderbookTradingProps {
  trading: string;
  exchanges: ExchangeDefinition[];
  holdings: Holding[];
}

export const FundOrderbookTrading: React.FC<FundOrderbookTradingProps> = props => {
  const environment = useEnvironment()!;
  const weth = environment.getToken('WETH');

  const [asset, setAsset] = useState(environment.getToken('DAI'));
  const [order, setOrder] = useState<OrderbookItem>();

  useEffect(() => {
    setOrder(undefined);
  }, [asset]);

  const tokens = environment.tokens.filter(token => token !== weth && !token.historic);
  const tokenOptions = tokens.map(token => ({
    value: token.address,
    name: `${token.symbol} / ${weth.symbol}`,
  }));

  return (
    <Block>
      <SectionTitle>Orderbook Trading</SectionTitle>

      <S.FundOrderbookTrading>
        <S.FundOrderbookForm>
          <Dropdown
            name="asset"
            label="Asset pair"
            options={tokenOptions}
            value={asset.address}
            onChange={event => setAsset(environment.getToken(event.target.value)!)}
          />

          {asset && (
            <FundOrderbookMarketForm
              trading={props.trading}
              asset={asset}
              order={order}
              unsetOrder={() => setOrder(undefined)}
              holdings={props.holdings}
              exchanges={props.exchanges}
            />
          )}
        </S.FundOrderbookForm>

        {asset && (
          <S.FundOrderbook>
            <FundOrderbook
              asset={asset}
              exchanges={props.exchanges}
              selected={order}
              setSelected={(order?: OrderbookItem) => {
                setOrder(order);
              }}
            />
          </S.FundOrderbook>
        )}
      </S.FundOrderbookTrading>
    </Block>
  );
};
