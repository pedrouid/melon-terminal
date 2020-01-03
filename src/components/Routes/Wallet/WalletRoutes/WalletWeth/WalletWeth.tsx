import React from 'react';

import WalletWrapEther from './WalletWrapEther/WalletWrapEther';
import WalletUnwrapEther from './WalletUnwrapEther/WalletUnwrapEther';

const WalletWeth: React.FC = () => {
  return (
    <>
      <WalletWrapEther />
      <WalletUnwrapEther />
    </>
  );
};

export default WalletWeth;
