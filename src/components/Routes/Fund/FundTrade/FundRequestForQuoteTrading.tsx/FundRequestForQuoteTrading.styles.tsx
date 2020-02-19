import styled from 'styled-components';
import { BlockActions, BlockSection } from '~/storybook/components/Block/Block';

export const OptionsContainer = styled(BlockActions)`
  flex-direction: column;
  @media (${props => props.theme.mediaQueries.m}) {
    flex-direction: row;
  }
`;

export const ButtonContainer = styled(BlockSection)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  @media (${props => props.theme.mediaQueries.m}) {
    align-items: flex-end;
  }
`;
