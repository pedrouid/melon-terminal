import styled from 'styled-components';

export const Container = styled.div`
  width: 200px;
  background: ${props => props.theme.mainColors.secondary};
  border-radius: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 35px;
`;

export const Button = styled.button`
  font-size: ${props => props.theme.fontSizes.xl};
  border: none;
  background-color: inherit;
  cursor: pointer;
`;

export const Span = styled.span``;

export const ButtonWrapper = styled.div``;
