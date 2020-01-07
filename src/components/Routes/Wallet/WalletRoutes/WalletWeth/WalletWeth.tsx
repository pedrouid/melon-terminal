import React from 'react';

import WalletWrapEther from './WalletWrapEther/WalletWrapEther';
import WalletUnwrapEther from './WalletUnwrapEther/WalletUnwrapEther';
import { Grid, GridRow, GridCol } from '~/storybook/components/Grid/Grid';
import { Block } from '~/storybook/components/Block/Block';

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
      <GridRow>
        <GridCol xs={12} sm={12}>
          <Block>
            The process of wrapping your Ether will get you WETH (Wrapped Ether) that you can then use to invest in a
            fund. Funds only accept investments in ERC20 tokens, so Ether needs to be wrapped to be invested in a fund.
          </Block>
        </GridCol>
      </GridRow>
    </Grid>
  );
};

export default WalletWeth;
