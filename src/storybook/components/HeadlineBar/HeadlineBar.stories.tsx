import React from 'react';
import { Bar, BarContent, BarSection } from '../Bar/Bar';
import { Headline } from '../Headline/Headline';
import { Button, ButtonGroup } from '../Button/Button';
import { DataBlock } from '../DataBlock/DataBlock';

export default { title: 'Layouts|HeadlineBar' };

export const Default: React.FC = () => {
  return (
    <Bar>
      <BarContent size="contained" justify="between">
        <Headline title="My title" text="My subtitle" icon="icon" />
      </BarContent>
    </Bar>
  );
};

export const JustTitle: React.FC = () => {
  return (
    <Bar>
      <BarContent size="contained" justify="between">
        <Headline title="My title" text="My subtitle" />
      </BarContent>
    </Bar>
  );
};

export const WithButtons: React.FC = () => {
  return (
    <Bar>
      <BarContent size="contained" justify="between">
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

export const WithData: React.FC = () => {
  return (
    <Bar>
      <BarContent size="contained" justify="between">
        <Headline title="My title" text="My subtitle" icon="icon" />
        <BarSection>
          <DataBlock label="Share Price">1.0000 WETH/Share</DataBlock>
          <DataBlock label="AUM">0.1000 WETH</DataBlock>
          <DataBlock label="Total number of shares">0.1000000</DataBlock>
          <DataBlock label="Shares owned by me">0.1000000</DataBlock>
        </BarSection>
      </BarContent>
    </Bar>
  );
};
