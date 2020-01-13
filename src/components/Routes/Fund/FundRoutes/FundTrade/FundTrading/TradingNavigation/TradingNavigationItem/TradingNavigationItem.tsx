import React from 'react';

import * as S from './TradingNavigationItem.styles';

export interface TradingNavigationItemProps {
  label: string;
  identifier: string;
}

export const TradingNavigationItem: React.FC<TradingNavigationItemProps> = props => {
  return <S.Content {...props}>{props.children}</S.Content>;
};
