import React from 'react';
import { Grid, GridCol, GridRow } from '~/storybook/components/Grid/Grid';
import { Container } from '~/storybook/components/Container/Container';
import { FundMetrics } from '~/components/Routes/Home/FundMetrics/FundMetrics';
import { FundOverview } from '~/components/Routes/Home/FundOverview/FundOverview';

export const Home: React.FC = () => {
  return (
    <Container>
      <Grid>
        <GridRow>
          <GridCol>
            <FundMetrics />
          </GridCol>
        </GridRow>
        <GridRow>
          <GridCol>
            <FundOverview />
          </GridCol>
        </GridRow>
      </Grid>
    </Container>
  );
};

export default Home;
