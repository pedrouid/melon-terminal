import styled from 'styled-components';

export interface ContainerProps {
  position: 'center' | 'flex-start' | 'flex-end';
}

export const Container = styled.ul<ContainerProps>`
  display: flex;
  flex-wrap: wrap;
  justify-content: ${props => props.position};
  align-items: center;
  font-size: 16px;
`;

export interface LiProps {
  selected?: boolean;
}

export const Li = styled.li<LiProps>`
  ${props => props.selected && 'font-weight: bold;'}
  ${props => props.selected && `background: ${props.theme.statusColors.neutral};`}
  padding-top: 1px;
  border: 1px solid black;
  border-right-width: 0;
  min-width: 30px;
  min-height: 30px;
  align-items: center;
  display: flex;
  justify-content: center;
  cursor: pointer;
  :last-child {
    border-right-width: 1px;
  }
`;
