import React from 'react';
import * as S from './FundShutdown.styles';
import { PaddedBody } from '~/components/Common/Styles/Styles';

export interface ShutdownProps {
  address: string;
}

export const Shutdown: React.FC<ShutdownProps> = ({ address }) => {
  return (
    <S.FundShutdownBody>
      <h1>Not yet implemented</h1>
    </S.FundShutdownBody>
  );
};

export default Shutdown;
