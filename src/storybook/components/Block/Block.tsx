import styled from 'styled-components';

export const Block = styled.div`
  position: relative;
  width: 100%;
  padding: ${props => props.theme.spaceUnits.l};
  border: ${props => props.theme.border.borderDefault};
  border-radius: ${props => props.theme.border.borderRadius};
  background: ${props => props.theme.mainColors.primary};
`;
