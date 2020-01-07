import React from 'react';
import { Skeleton, SkeletonHead, SkeletonBody, SkeletonFeet } from './Skeleton';
import { Default as Header } from '../Header/Header.stories';
import { Bar, BarContent } from '../Bar/Bar';
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
          <BarContent size="contained" justify="between">
            <Headline title="My title" text="My subtitle" icon="icon" />
          </BarContent>
        </Bar>
        <Container>
          <SimpleGridSample />
        </Container>
      </SkeletonBody>
      <SkeletonFeet>
        <div>Footer here</div>
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
          <BarContent size="contained" justify="between">
            <Headline title="My title" text="My subtitle" icon="icon" />
          </BarContent>
        </Bar>
        <Container full={true}>
          <ComplexGridSample />
        </Container>
      </SkeletonBody>
      <SkeletonFeet>
        <div>Footer here</div>
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
        <Container>
          <NoBlockGridSample />
        </Container>
      </SkeletonBody>
      <SkeletonFeet>
        <div>Footer here</div>
      </SkeletonFeet>
    </Skeleton>
  );
};
