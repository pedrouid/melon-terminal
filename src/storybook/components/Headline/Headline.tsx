import React from 'react';
import * as H from './Headline.styles';
import { Title } from '../Title/Title';

export interface HeadlineProps {
  title: string;
  text?: string;
  icon?: string;
}

export const Headline: React.FC<HeadlineProps> = props => {
  return (
    <H.Headline>
      {props.icon && <H.HeadlineIcon icon={props.icon} />}
      <H.HeadlineText>
        <Title>{props.title}</Title>
        {props.text && <H.HeadlineSideInfo>{props.text}</H.HeadlineSideInfo>}
      </H.HeadlineText>
    </H.Headline>
  );
};
