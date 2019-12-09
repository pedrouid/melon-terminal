import React from 'react';
import * as S from './Home.styles';
import { FundOverview } from './FundOverview/FundOverview';

export const Home = () => (
  <>
    <S.HomeBody>
      <FundOverview />
    </S.HomeBody>
  </>
);

export default Home;
