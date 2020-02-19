import styled from 'styled-components';

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 ${props => props.theme.spaceUnits.m};
  margin: ${props => props.theme.spaceUnits.s} 0;
`;
