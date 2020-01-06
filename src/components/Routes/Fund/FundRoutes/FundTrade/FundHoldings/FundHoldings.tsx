import React, { useMemo, useLayoutEffect } from 'react';
import BigNumber from 'bignumber.js';
import { TokenDefinition } from '@melonproject/melonjs';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import { useFundHoldingsQuery } from '~/queries/FundHoldings';
import {
  Table,
  HeaderCell,
  HeaderCellRightAlign,
  BodyCell,
  BodyCellRightAlign,
  HeaderRow,
  BodyRowHover,
  BodyRow,
} from '~/components/Common/Table/Table.styles';
import * as S from './FundHoldings.styles';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Block } from '~/storybook/components/Block/Block';
import { SectionTitle } from '~/storybook/components/Title/Title';

export interface FundHoldingsProps {
  address: string;
  asset?: TokenDefinition;
  setAsset: (asset: TokenDefinition) => void;
}

export const FundHoldings: React.FC<FundHoldingsProps> = props => {
  const environment = useEnvironment()!;
  const [holdings, query] = useFundHoldingsQuery(props.address);

  useLayoutEffect(() => {
    if (props.asset) {
      return;
    }

    const holding = holdings.find(holding => holding.token?.symbol !== 'WETH');
    holding && props.setAsset(environment.getToken(holding.token!.symbol!));
  }, [holdings]);

  const mapped = useMemo(
    () =>
      (holdings || [])
        .filter(holding => holding && holding.token)
        .map(holding => {
          const decimals = holding.token?.decimals;
          const amount = holding.amount;

          return {
            ...holding,
            // TODO: This should be done in the graphql api.
            divided:
              decimals && amount ? amount.dividedBy(new BigNumber(10).exponentiatedBy(decimals)) : new BigNumber(0),
          };
        }),
    [holdings]
  );

  if (query.loading) {
    return (
      <Block>
        <SectionTitle>Holdings</SectionTitle>
        <Spinner />
      </Block>
    );
  }

  return (
    <Block>
      <SectionTitle>Holdings</SectionTitle>
      <Table>
        <thead>
          <HeaderRow>
            <HeaderCell>Asset</HeaderCell>
            <HeaderCellRightAlign>Price</HeaderCellRightAlign>
            <HeaderCellRightAlign>Balance</HeaderCellRightAlign>
          </HeaderRow>
        </thead>
        <tbody>
          {mapped.map(holding => {
            const token = environment.getToken(holding.token!.symbol!);
            const selected = token.symbol === props.asset?.symbol;
            const handleClick = token.symbol === 'WETH' ? undefined : () => props.setAsset(token);
            const Component = token.symbol === 'WETH' ? BodyRow : BodyRowHover;

            return (
              <Component key={holding.token?.address} highlighted={selected} onClick={handleClick}>
                <BodyCell>
                  <span>{holding.token?.symbol}</span>
                  <br />
                  <S.HoldingName>{holding.token?.name}</S.HoldingName>
                </BodyCell>
                <BodyCellRightAlign>{holding.token?.price?.toFixed(4)}</BodyCellRightAlign>
                <BodyCellRightAlign>{holding.divided?.toFixed(4)}</BodyCellRightAlign>
              </Component>
            );
          })}
        </tbody>
      </Table>
    </Block>
  );
};
