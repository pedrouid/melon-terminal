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
import METAMASK from './svg/wallet/metamask.svg';
import FRAME from './svg/wallet/frame.svg';
import GANACHE from './svg/wallet/ganache.svg';
import * as S from './Icons.styles';

export enum IconName {
  'ANT' = 'ANT',
  'BAT' = 'BAT',
  'DAI' = 'DAI',
  'ENG' = 'ENG',
  'KNC' = 'KNC',
  'LINK' = 'LINK',
  'MANA' = 'MANA',
  'MKR' = 'MKR',
  'MLN' = 'MLN',
  'OMG' = 'OMG',
  'REN' = 'REN',
  'REP' = 'REP',
  'RLC' = 'RLC',
  'SAI' = 'SAI',
  'USDC' = 'USDC',
  'USDT' = 'USDT',
  'WBTC' = 'WBTC',
  'WETH' = 'WETH',
  'ZRX' = 'ZRX',
  'METAMASK' = 'METAMASK',
  'FRAME' = 'FRAME',
  'GANACHE' = 'GANACHE',
}

export type IconsProps = React.ComponentProps<typeof L.IconsWrapper> & {
  name: IconName;
  size?: 'normal' | 'small';
};

const icons = {
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
  METAMASK,
  FRAME,
  GANACHE,
};

export const Icons: React.FC<IconsProps> = ({ name, size, ...props }) => {
  size = size || 'normal';

  return (
    <S.IconsWrapper {...props}>
      <S.Img src={icons[name]} size={size} />
    </S.IconsWrapper>
  );
};
