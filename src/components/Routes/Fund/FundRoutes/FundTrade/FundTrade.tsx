import React from 'react';
import { ExchangeIdentifier } from '@melonproject/melonjs';
import { RequiresFundManager } from '~/components/Gates/RequiresFundManager/RequiresFundManager';
import { Grid, GridRow, GridCol } from '~/storybook/components/Grid/Grid';
import { FundHoldings } from '~/components/Routes/Fund/FundHoldings/FundHoldings';
import { RequiresFundNotShutDown } from '~/components/Gates/RequiresFundNotShutDown/RequiresFundNotShutDown';
import { RequiresFundDeployedWithCurrentVersion } from '~/components/Gates/RequiresFundDeployedWithCurrentVersion/RequiresFundDeployedWithCurrentVersion';
import { FundLiquidityProviderTrading } from '~/components/Routes/Fund/FundRoutes/FundTrade/FundLiquidityProviderTrading/FundLiquidityProviderTrading';
import { FundOrderbookTrading } from '~/components/Routes/Fund/FundRoutes/FundTrade/FundOrderbookTrading/FundOrderbookTrading';
import { useFundHoldingsQuery } from '~/queries/FundHoldings';
import { useFundTrading } from './FundTrade.query';
import { FundOpenOrders } from './FundOpenOrders/FundOpenOrders';
import { FundTradeHistory } from './FundTradeHistory/FundTradeHistory';

export interface FundTradeProps {
  address: string;
}

export const FundTrade: React.FC<FundTradeProps> = ({ address }) => {
  const [exchanges, exchangesQuery] = useFundTrading(address);
  const [holdings, holdingsQuery] = useFundHoldingsQuery(address);
  const loading = exchangesQuery.loading && holdingsQuery.loading;

  const markets = exchanges.filter(exchange => {
    const supported = [ExchangeIdentifier.OasisDex, ExchangeIdentifier.ZeroExV3];
    return supported.includes(exchange.id as ExchangeIdentifier);
  });

  const providers = exchanges.filter(exchange => {
    const supported = [ExchangeIdentifier.KyberNetwork, ExchangeIdentifier.Uniswap, ExchangeIdentifier.MelonEngine];
    return supported.includes(exchange.id as ExchangeIdentifier);
  });

  return (
    <Grid>
      {!loading && (!!providers.length || !!markets.length) && (
        <RequiresFundManager fallback={false}>
          <RequiresFundDeployedWithCurrentVersion address={address} fallback={false}>
            <RequiresFundNotShutDown fallback={false}>
              <GridRow>
                {!!markets.length && (
                  <GridCol>
                    <FundOrderbookTrading address={address} exchanges={markets} holdings={holdings} />
                  </GridCol>
                )}
              </GridRow>
              <GridRow>
                {!!providers.length && (
                  <GridCol>
                    <FundLiquidityProviderTrading address={address} exchanges={providers} holdings={holdings} />
                  </GridCol>
                )}
              </GridRow>

              <GridRow>
                <GridCol>
                  <FundHoldings address={address} />
                </GridCol>
              </GridRow>
            </RequiresFundNotShutDown>
          </RequiresFundDeployedWithCurrentVersion>
        </RequiresFundManager>
      )}

      <GridRow>
        <GridCol>
          <FundOpenOrders address={address} />
        </GridCol>
      </GridRow>

      <GridRow>
        <GridCol>
          <FundTradeHistory address={address} />
        </GridCol>
      </GridRow>
    </Grid>
  );
};

export default FundTrade;
