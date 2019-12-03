import styled from 'styled-components';
import { Subtitle } from '~/components/Common/Styles/Styles';

export const Wrapper = styled.div`
  @media (${props => props.theme.mediaQueries.l}) {
    border-top: none;
  }

  background-color: rgb(255, 255, 255);
  flex: 1 0 25%;
  min-width: 256px;
`;

export const Title = Subtitle;
