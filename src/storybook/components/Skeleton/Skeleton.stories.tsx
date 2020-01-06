import React from 'react';
import { Skeleton, SkeletonHead, SkeletonBody, SkeletonFeet } from './Skeleton';

export default { title: 'Structure|Skeleton' };

export const Deafult: React.FC = () => {
  return (
    <Skeleton>
      <SkeletonHead />
      <SkeletonBody />
      <SkeletonFeet />
    </Skeleton>
  );
};
