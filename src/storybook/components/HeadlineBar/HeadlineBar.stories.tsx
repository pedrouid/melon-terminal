import React from 'react';
import { Bar, BarContent } from '../Bar/Bar';
import { Headline } from '../Headline/Headline';
import { Button, ButtonGroup } from '../Button/Button';
import { DataBlock, DataBlockSection } from '../DataBlock/DataBlock';

export default { title: 'Layouts|HeadlineBar' };

export const Default: React.FC = () => {
  return (
    <Bar>
      <BarContent justify="between">
        <Headline title="My title" text="My subtitle" icon="icon" />
      </BarContent>
    </Bar>
  );
};

export const JustTitle: React.FC = () => {
  return (
    <Bar>
      <BarContent justify="between">
        <Headline title="My title" text="My subtitle" />
      </BarContent>
    </Bar>
  );
};

export const WithButtons: React.FC = () => {
  return (
    <Bar>
      <BarContent justify="between">
        <Headline title="My title" text="My subtitle" icon="icon" />
        <ButtonGroup justify="end">
          <Button>button 1</Button>
          <Button>button 2</Button>
          <Button>other button</Button>
          <Button kind="danger">button danger</Button>
        </ButtonGroup>
      </BarContent>
    </Bar>
  );
};

export const WithDataBlock: React.FC = () => {
  return (
    <Bar>
      <BarContent justify="between">
        <Headline title="My title" text="My subtitle" icon="icon" />
        <DataBlockSection>
          <DataBlock label="Share Price">1.0000000 WETH/Share</DataBlock>
          <DataBlock label="AUM">0.1000 WETH</DataBlock>
          <DataBlock label="Creation date">02.Mar 2019 00:52</DataBlock>
        </DataBlockSection>
      </BarContent>
    </Bar>
  );
};
