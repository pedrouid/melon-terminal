import React from 'react';
import * as L from './Icons.styles';
import BAT from './svg/BAT.svg';
import DAI from './svg/DAI.svg';
import ETH from './svg/ETH.svg';
import WETH from './svg/ETH.svg';
import KNC from './svg/KNC.svg';
import MKR from './svg/MKR.svg';
import MLN from './svg/MLN.svg';
import REP from './svg/REP.svg';
import ZRX from './svg/ZRX.svg';
import METAMASK from './svg/Metamask.svg';
import FRAME from './svg/Frame.svg';
import GANACHE from './svg/Ganache.svg';

export type IconName =
  | 'BAT'
  | 'DAI'
  | 'ETH'
  | 'WETH'
  | 'KNC'
  | 'MKR'
  | 'MLN'
  | 'REP'
  | 'ZRX'
  | 'METAMASK'
  | 'FRAME'
  | 'GANACHE';

export type IconsProps = React.ComponentProps<typeof L.IconsWrapper> & {
  name: IconName;
  size?: 'normal' | 'small';
};

const icons = { BAT, DAI, ETH, WETH, KNC, MKR, MLN, REP, ZRX, METAMASK, FRAME, GANACHE };

export const Icons: React.FC<IconsProps> = ({ name, size, ...props }) => {
  size = size || 'normal';

  return (
    <L.IconsWrapper {...props}>
      <L.Img src={icons[name]} size={size} />
    </L.IconsWrapper>
  );
};
