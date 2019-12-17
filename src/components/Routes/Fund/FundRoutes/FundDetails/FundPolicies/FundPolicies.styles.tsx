import styled from 'styled-components';
import { Subtitle } from '~/components/Common/Styles/Styles';

export const Wrapper = styled.div`
  position: relative;
  min-height: 200px;
  overflow: scroll;
  @media (${props => props.theme.mediaQueries.l}) {
    flex: 1;
    border-right: 1px solid rgb(234, 229, 212);
    border-top: none;
    flex: 0 0 25%;
    order: 1;
  }
`;

export const Title = Subtitle;
