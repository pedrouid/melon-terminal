import React from 'react';
import ANT from './svg/tokens/ant.svg';
import BAT from './svg/tokens/bat.svg';
import DAI from './svg/tokens/dai.svg';
import ENG from './svg/tokens/eng.svg';
import KNC from './svg/tokens/knc.svg';
import LINK from './svg/tokens/link.svg';
import MANA from './svg/tokens/mana.svg';
import MKR from './svg/tokens/mkr.svg';
import MLN from './svg/tokens/mln.svg';
import OMG from './svg/tokens/omg.svg';
import REN from './svg/tokens/ren.svg';
import REP from './svg/tokens/rep.svg';
import RLC from './svg/tokens/rlc.svg';
import SAI from './svg/tokens/sai.svg';
import USDC from './svg/tokens/usdc.svg';
import USDT from './svg/tokens/usdt.svg';
import WBTC from './svg/tokens/wbtc.svg';
import WETH from './svg/tokens/weth.svg';
import ZRX from './svg/tokens/zrx.svg';
import DGX from './svg/tokens/dgx.svg';
import EUR from './svg/tokens/eur.svg';
import METAMASK from './svg/wallet/metamask.svg';
import FRAME from './svg/wallet/frame.svg';
import GANACHE from './svg/wallet/ganache.svg';
import TWITTER from './svg/socialNetwork/twitter.svg';
import LEFTARROW from './svg/leftArrow.svg';
import SWAPARROWS from './svg/swapArrows.svg';
import EXCHANGE from './svg/exchange.svg';
import FORTMATIC from './svg/wallet/fortmatic.svg';
import WALLETCONNECT from './svg/wallet/walletconnect.svg';
import * as S from './Icons.styles';

const availableIcons = {
  ANT,
  BAT,
  DAI,
  ENG,
  KNC,
  LINK,
  MANA,
  MKR,
  MLN,
  OMG,
  REN,
  REP,
  RLC,
  SAI,
  USDC,
  USDT,
  WBTC,
  WETH,
  ZRX,
  DGX,
  EUR,
  METAMASK,
  FRAME,
  GANACHE,
  TWITTER,
  LEFTARROW,
  SWAPARROWS,
  EXCHANGE,
  FORTMATIC,
  WALLETCONNECT,
};

export type IconName = keyof typeof availableIcons;

export type IconsProps = React.ComponentProps<typeof S.IconsWrapper> & {
  name: IconName;
  size?: 'normal' | 'small';
  pointer?: boolean;
};

export const Icons: React.FC<IconsProps> = ({ name, size, pointer, ...props }) => {
  size = size || 'normal';

  return (
    <S.IconsWrapper {...props} size={size} pointer={pointer}>
      <S.Img src={availableIcons[name]} size={size} />
    </S.IconsWrapper>
  );
};
