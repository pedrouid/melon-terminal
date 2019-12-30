import styled from 'styled-components';
import { Subtitle } from '~/components/Common/Styles/Styles';

export const Wrapper = styled.div`
  position: relative;
  margin-bottom: ${props => props.theme.spaceUnits.xxl};
`;

export const Title = Subtitle;
