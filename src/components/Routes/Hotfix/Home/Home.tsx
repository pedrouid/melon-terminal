import React from 'react';
import * as S from './Home.styles';
import { FundOverview } from './FundOverview/FundOverview';
import { HomeHeader } from './HomeHeader/HomeHeader';
import { useEnvironment } from '~/hooks/useEnvironment';

export const Home = () => {
  const environment = useEnvironment()!;

  return (
    <>
      <S.HomeHeader>
        <HomeHeader address={environment.account!} />
      </S.HomeHeader>
      <S.HomeBody>
        <FundOverview />
      </S.HomeBody>
    </>
  );
};

export default Home;
