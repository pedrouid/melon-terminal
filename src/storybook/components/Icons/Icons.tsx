import React, { Suspense, lazy } from 'react';
import * as S from './Icons.styles';


const availableIcons = {
  ANT: lazy(() => import('./svg/tokens/Ant')),
  BAT: lazy(() => import('./svg/tokens/Bat')),
  DAI: lazy(() => import('./svg/tokens/Dai')),
  ENG: lazy(() => import('./svg/tokens/Eng')),
  KNC: lazy(() => import('./svg/tokens/Knc')),
  LINK: lazy(() => import('./svg/tokens/Link')),
  MANA: lazy(() => import('./svg/tokens/Mana')),
  MKR: lazy(() => import('./svg/tokens/Mkr')),
  MLN: lazy(() => import('./svg/tokens/Mln')),
  OMG: lazy(() => import('./svg/tokens/Omg')),
  REN: lazy(() => import('./svg/tokens/Ren')),
  REP: lazy(() => import('./svg/tokens/Rep')),
  RLC: lazy(() => import('./svg/tokens/Rlc')),
  SAI: lazy(() => import('./svg/tokens/Sai')),
  USDC: lazy(() => import('./svg/tokens/Usdc')),
  USDT: lazy(() => import('./svg/tokens/Usdt')),
  WBTC: lazy(() => import('./svg/tokens/Wbtc')),
  WETH: lazy(() => import('./svg/tokens/Weth')),
  ZRX: lazy(() => import('./svg/tokens/Zrx')),
  DGX: lazy(() => import('./svg/tokens/Dgx')),
  EUR: lazy(() => import('./svg/tokens/Eur')),
  DAPPER: lazy(() => import('./svg/tokens/Dapper')),
  METAMASK: lazy(() => import('./svg/wallet/Metamask')),
  FRAME: lazy(() => import('./svg/wallet/Frame')),
  GANACHE: lazy(() => import('./svg/wallet/Ganache')),
  TWITTER: lazy(() => import('./svg/socialNetwork/Twitter')),
  LEFTARROW: lazy(() => import('./svg/LeftArrow')),
  SWAPARROWS: lazy(() => import('./svg/SwapArrows')),
  EXCHANGE: lazy(() => import('./svg/Exchange')),
  FORTMATIC: lazy(() => import('./svg/wallet/Fortmatic')),
  SUN: lazy(() => import('./svg/Sun')),
  MOON: lazy(() => import('./svg/Moon')),
  ETHEREUM: lazy(() => import('./svg/Ethereum')),
  WALLET: lazy(() => import('./svg/Wallet')),
};

export type IconName = keyof typeof availableIcons;

export type IconsProps = React.ComponentProps<typeof S.IconsWrapper> & {
  name: IconName;
  size?: 'normal' | 'small';
  pointer?: boolean;
};

export const Icons: React.FC<IconsProps> = ({ name, size, pointer, ...props }) => {
  size = size || 'normal';

  const Component = availableIcons[name];

  return (
    <S.IconsWrapper {...props} size={size} pointer={pointer}>
      <Suspense fallback={<S.Loading />}>
        <Component />
      </Suspense>
    </S.IconsWrapper>
  );
};
