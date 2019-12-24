import React from 'react';

import WalletWrapEther from './WalletWrapEther/WalletWrapEther';
import WalletUnwrapEther from './WalletUnwrapEther/WalletUnwrapEther';

import * as S from './WalletWeth.styles';

const WalletWeth: React.FC = () => {
  return (
    <S.Container>
      <WalletWrapEther />
      <WalletUnwrapEther />
    </S.Container>
  );
};

export default WalletWeth;
