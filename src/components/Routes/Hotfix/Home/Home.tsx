import React from 'react';
import * as S from './Home.styles';
import { Overview } from './Overview/Overview';
import { HomeHeader } from './HomeHeader/HomeHeader';
import { useEnvironment } from '~/hooks/useEnvironment';

export const Home = () => {
  const environment = useEnvironment();
  if (!environment || !environment.account) {
    return null;
  }

  return (
    <>
      <S.HomeHeader>
        <HomeHeader address={environment.account} />
      </S.HomeHeader>
      <S.HomeBody>
        <Overview />
      </S.HomeBody>
    </>
  );
};

export default Home;
