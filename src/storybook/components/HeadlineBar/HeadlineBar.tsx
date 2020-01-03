import React from 'react';
import * as H from './HeadlineBar.styles';
import { Container } from '../Container/Container';
import { Headline } from '../Headline/Headline';
import { Button } from '../Button/Button';

export interface HeadlineBarProps {
  title: string;
  subtitle: string;
}

export const HeadlineBar: React.FC<HeadlineBarProps> = props => {
  return (
    <H.HeadlineBar>
      <Container>
        <H.HeadlineBarContent>
          <Headline title={props.title} text={props.subtitle} icon="icon" />
          <H.HeadlineBarActions>
            <Button>button 1</Button>
            <Button>button 2</Button>
            <Button>other button</Button>
            <Button kind="danger">button danger</Button>
          </H.HeadlineBarActions>
        </H.HeadlineBarContent>
      </Container>
    </H.HeadlineBar>
  );
};
