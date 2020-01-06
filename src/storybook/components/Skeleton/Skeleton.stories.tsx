import React from 'react';
import { Skeleton, SkeletonHead, SkeletonBody, SkeletonFeet } from './Skeleton';
import { Default as Header } from '../Header/Header.stories.tsx';
import { Bar, BarContent } from '../Bar/Bar';
import { Headline } from '../Headline/Headline';
import { Container } from '../Container/Container';
import { FundLayout as ComplexGridSample } from '../Grid/Grid.stories.tsx';
import { TwoColumns as SimpleGridSample } from '../Grid/Grid.stories.tsx';
import { WithoutBlocks as NoBlockGridSample } from '../Grid/Grid.stories.tsx';


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
      <SkeletonHead debug>
        <div>Header here</div>
      </SkeletonHead>
      <SkeletonBody debug>
        <div>App content here</div>
      </SkeletonBody>
      <SkeletonFeet debug>
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
        <Container full>
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
