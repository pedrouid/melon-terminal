import React from 'react';
import { Skeleton, SkeletonHead, SkeletonBody, SkeletonFeet } from './Skeleton';
import { Default as Header } from '../Header/Header.stories';
import { Default as Footer } from '../Footer/Footer.stories';
import { Bar, BarContent } from '../Bar/Bar';
import { DataBlockBar, DataBlockBarContent } from '../DataBlockBar/DataBlockBar';
import { DataBlock } from '../DataBlock/DataBlock';
import { Headline } from '../Headline/Headline';
import { Container } from '../Container/Container';
import {
  FundLayout as ComplexGridSample,
  TwoColumns as SimpleGridSample,
  WithoutBlocks as NoBlockGridSample,
} from '../Grid/Grid.stories';

export default { title: 'Structure|Skeleton' };

export const Deafult: React.FC = () => {
  return (
    <Skeleton>
      <SkeletonHead>
        <div>Header here</div>
      </SkeletonHead>
      <SkeletonBody>
        <div>App content here</div>
      </SkeletonBody>
      <SkeletonFeet>
        <div>Footer here</div>
      </SkeletonFeet>
    </Skeleton>
  );
};

export const Debug: React.FC = () => {
  return (
    <Skeleton>
      <SkeletonHead debug={true}>
        <div>Header here</div>
      </SkeletonHead>
      <SkeletonBody debug={true}>
        <div>App content here</div>
      </SkeletonBody>
      <SkeletonFeet debug={true}>
        <div>Footer here</div>
      </SkeletonFeet>
    </Skeleton>
  );
};

export const WithBlocksContained: React.FC = () => {
  return (
    <Skeleton>
      <SkeletonHead>
        <Header />
      </SkeletonHead>
      <SkeletonBody>
        <Bar>
          <BarContent justify="between">
            <Headline title="My title" text="My subtitle" icon="icon" />
          </BarContent>
        </Bar>
        <Container>
          <SimpleGridSample />
        </Container>
      </SkeletonBody>
      <SkeletonFeet>
        <Footer />
      </SkeletonFeet>
    </Skeleton>
  );
};

export const WithBlocksFull: React.FC = () => {
  return (
    <Skeleton>
      <SkeletonHead>
        <Header />
      </SkeletonHead>
      <SkeletonBody>
        <Bar>
          <BarContent justify="between">
            <Headline title="My title" text="My subtitle" icon="icon" />
          </BarContent>
        </Bar>
        <DataBlockBar>
          <DataBlockBarContent justify="between">
            <DataBlock label="Share Price">1.0000000 WETH/Share</DataBlock>
            <DataBlock label="AUM">0.1000 WETH</DataBlock>
            <DataBlock label="Creation date">02.Mar 2019 00:52</DataBlock>
            <DataBlock label="Total number of shares">0.1000000</DataBlock>
            <DataBlock label="Shares owned by me">0.1000000</DataBlock>
            <DataBlock label="Management fee">0.5%</DataBlock>
            <DataBlock label="Performance fee">0%</DataBlock>
            <DataBlock label="Performance fee period">90 days</DataBlock>
          </DataBlockBarContent>
        </DataBlockBar>
        <Container full={true}>
          <ComplexGridSample />
        </Container>
      </SkeletonBody>
      <SkeletonFeet>
        <Footer />
      </SkeletonFeet>
    </Skeleton>
  );
};

export const WithotSecondaryBar: React.FC = () => {
  return (
    <Skeleton>
      <SkeletonHead>
        <Header />
      </SkeletonHead>
      <SkeletonBody>
        <Bar>
          <BarContent justify="between">
            <Headline title="My title" text="My subtitle" icon="icon" />
          </BarContent>
        </Bar>
        <DataBlockBar>
          <DataBlockBarContent justify="between">
            <DataBlock label="Share Price">1.0000000 WETH/Share</DataBlock>
            <DataBlock label="AUM">0.1000 WETH</DataBlock>
            <DataBlock label="Creation date">02.Mar 2019 00:52</DataBlock>
            <DataBlock label="Total number of shares">0.1000000</DataBlock>
            <DataBlock label="Shares owned by me">0.1000000</DataBlock>
            <DataBlock label="Management fee">0.5%</DataBlock>
            <DataBlock label="Performance fee">0%</DataBlock>
            <DataBlock label="Performance fee period">90 days</DataBlock>
          </DataBlockBarContent>
        </DataBlockBar>
        <Container>
          <NoBlockGridSample />
        </Container>
      </SkeletonBody>
      <SkeletonFeet>
        <Footer />
      </SkeletonFeet>
    </Skeleton>
  );
};
