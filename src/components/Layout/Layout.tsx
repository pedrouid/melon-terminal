import React from 'react';
import { Body } from './Body/Body';
import { Header } from './Header/Header';
import { Footer } from './Footer/Footer';

import { Skeleton } from '~/storybook/components/Skeleton/Skeleton';

export const Layout: React.FC = ({ children }) => (
  <Skeleton>
    <Header />
    <Body>{children}</Body>
    <Footer />
  </Skeleton>
);
