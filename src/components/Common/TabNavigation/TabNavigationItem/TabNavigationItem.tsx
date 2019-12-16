import React from 'react';

import * as S from './TabNavigationItem.styles';

export interface TabNavigationItemProps {
  label: string;
  identifier: string;
}

export const TabNavigationItem: React.FC<TabNavigationItemProps> = props => {
  return <S.Content {...props}>{props.children}</S.Content>;
};
