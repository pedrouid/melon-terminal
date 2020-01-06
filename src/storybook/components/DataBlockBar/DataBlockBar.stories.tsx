import React from 'react';
import { Bar, BarContent } from '../Bar/Bar';
import { DataBlock } from '../DataBlock/DataBlock';

export default { title: 'Layouts|DataBlockBar' };

export const Deafult: React.FC = () => {
  return (
    <Bar>
      <BarContent size="full" justify="between">
        <DataBlock label="Share Price">1.0000000 WETH/Share</DataBlock>
        <DataBlock label="AUM">0.1000 WETH</DataBlock>
        <DataBlock label="Ranking">4 out of 8</DataBlock>
        <DataBlock label="Total number of shares">0.1000000</DataBlock>
        <DataBlock label="Shares owned by me">0.1000000</DataBlock>
        <DataBlock label="Creation date:">02.Mar 2019 00:52</DataBlock>
      </BarContent>
    </Bar>
  );
};
