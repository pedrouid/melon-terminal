import React from 'react';
import * as L from './Icons.styles';
import BAT from './svg/BAT.svg';
import DAI from './svg/DAI.svg';
import ETH from './svg/ETH.svg';
import KNC from './svg/KNC.svg';
import MKR from './svg/MKR.svg';
import MLN from './svg/MLN.svg';
import REP from './svg/REP.svg';
import ZRX from './svg/ZRX.svg';
import Metamask from './svg/Metamask.svg';
import Frame from './svg/Frame.svg';
import Ganache from './svg/Ganache.svg';

export interface IconsProps {
  name: 'BAT' | 'DAI' | 'ETH' | 'KNC' | 'MKR' | 'MLN' | 'REP' | 'ZRX' | 'Metamask' | 'Frame' | 'Ganache';
}

const icons = { BAT, DAI, ETH, KNC, MKR, MLN, REP, ZRX, Metamask, Frame, Ganache };

export const Icons: React.FC<IconsProps> = ({ name }) => {
  return (
    <L.IconsWrapper>
      <L.Img src={icons[name]} />
    </L.IconsWrapper>
  );
};
