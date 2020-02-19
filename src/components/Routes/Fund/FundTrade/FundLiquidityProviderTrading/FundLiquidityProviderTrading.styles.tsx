import styled from 'styled-components';
import { GridRow } from '~/storybook/components/Grid/Grid';
import { BlockActions } from '~/storybook/components/Block/Block';

export const SwitchButton = styled.div`
  margin: auto;
  cursor: pointer;
`;

export const DropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-right: ${props => props.theme.spaceUnits.m};
`;

export const ExchangeContainer = styled.div`
  display: flex:
  flex-direction: row;
  justify-content: space-around;
  
`;

export const optionsContainer = styled(BlockActions)`
  flex-direction: column;
  @media (${props => props.theme.mediaQueries.m}) {
    flex-direction: row;
  }
`