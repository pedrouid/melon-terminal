import React from 'react';

import { SkeletonBody } from '~/storybook/components/Skeleton/Skeleton';

export const Body: React.FC = ({ children }) => <SkeletonBody>{children}</SkeletonBody>;
