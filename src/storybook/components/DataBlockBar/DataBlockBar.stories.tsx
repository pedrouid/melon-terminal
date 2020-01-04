import React from 'react';
import { Bar, BarContent } from '../Bar/Bar';
import { DataBlock } from '../DataBlock/DataBlock';

export default { title: 'Layouts|DataBlockBar' };

export const Deafult: React.FC = () => {
  return (
    <Bar>
      <BarContent size="full" justify="between">
        <DataBlock label="Share Price" content="1.0000000 WETH/Share" />
        <DataBlock label="AUM" content="0.1000 WETH" />
        <DataBlock label="Ranking" content="4 out of 8" />
        <DataBlock label="Total number of shares" content="0.1000000" />
        <DataBlock label="Shares owned by me" content="0.1000000" />
        <DataBlock label="Creation date:" content="02.Mar 2019 00:52" />
      </BarContent>
    </Bar>
  );
};
