import styled from 'styled-components';
import { Subtitle } from '~/components/Common/Styles/Styles';

export const Wrapper = styled.div`
  height: 350px;
  overflow: auto;
  @media (${props => props.theme.mediaQueries.l}) {
    border-right: 1px solid rgb(234, 229, 212);
  }
  @media (${props => props.theme.mediaQueries.m}) {
    flex: 1 0 50%;
  }
  overflow: hidden;
  min-width: 300px;
`;

export const Title = Subtitle;
