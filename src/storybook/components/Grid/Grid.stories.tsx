import React from 'react';
import { Grid } from './Grid';

export default { title: 'Structure|Grid' };

export const Default: React.FC = () => <Grid layout="default" />;

export const Fund: React.FC = () => <Grid layout="fund" />;

export const CenteredSmall: React.FC = () => <Grid layout="small-center" />;

export const CenteredMedium: React.FC = () => <Grid layout="medium-center" />;
