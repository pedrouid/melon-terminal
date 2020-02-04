import React from 'react';
import { Spinner } from '~/storybook/components/Spinner/Spinner';
import { useFundHoldingsQuery } from '~/queries/FundHoldings';
import * as S from './FundHoldings.styles';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { Block } from '~/storybook/components/Block/Block';
import { TokenBalance } from '~/components/Common/TokenBalance/TokenBalance';

export interface FundHoldingsProps {
  address: string;
}

export const FundHoldings: React.FC<FundHoldingsProps> = ({ address }) => {
  const [holdings, query] = useFundHoldingsQuery(address);

  if (query.loading) {
    return (
      <Block>
        <SectionTitle>Portfolio holdings</SectionTitle>
        <Spinner />
      </Block>
    );
  }

  return (
    <Block>
      <SectionTitle>Portfolio holdings</SectionTitle>
      {holdings.map((holding, key) => (
        <S.Balance key={key}>
          <TokenBalance value={holding.amount} decimals={holding.token!.decimals!} symbol={holding.token?.symbol} />
        </S.Balance>
      ))}
    </Block>
  );
};
