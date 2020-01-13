import styled from 'styled-components';

export interface ColorProps {
  color: 'red' | 'green' | 'grey';
}

export const Color = styled.span<ColorProps>`
  color: ${props => props.theme.otherColors[props.color]};
`;
