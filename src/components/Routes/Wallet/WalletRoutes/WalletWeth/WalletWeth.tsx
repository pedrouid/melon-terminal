import React from 'react';

import WalletWrapEther from './WalletWrapEther/WalletWrapEther';
import WalletUnwrapEther from './WalletUnwrapEther/WalletUnwrapEther';
import { Grid, GridRow, GridCol } from '~/storybook/components/Grid/Grid';

const WalletWeth: React.FC = () => {
  return (
    <Grid>
      <GridRow>
        <GridCol xs={12} sm={6}>
          <WalletWrapEther />
        </GridCol>
        <GridCol xs={12} sm={6}>
          <WalletUnwrapEther />
        </GridCol>
      </GridRow>
    </Grid>
  );
};

export default WalletWeth;
