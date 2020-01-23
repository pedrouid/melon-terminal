import styled, { css } from 'styled-components';
import { PolicyPositionNotPreOrPostError } from '@melonproject/melonjs';

export const Wrapper = styled.div`
  position: relative;
  margin-bottom: ${props => props.theme.spaceUnits.xxl};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const OrderbookHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 6px;
`;

export const OrderbookBody = styled.div`
  position: relative;
  z-index: 1;
`;

export interface OrderbookLabelProps {
  left?: boolean;
  width?: string;
}

export const OrderbookLabel = styled.span<OrderbookLabelProps>`
  text-align: ${props => (props.left ? 'left' : 'right')};
  width: ${props => (props.width ? props.width : '40%')};
`;

export interface OrderbookDataProps {
  left?: boolean;
  width?: string;
}

export const OrderbookData = styled.span<OrderbookDataProps>`
  font-size: ${props => props.theme.fontSizes.s};
  text-align: ${props => (props.left ? 'left' : 'right')};
  width: ${props => (props.width ? props.width : '33%')};
`;

export const OrderbookPrice = styled.span``;

export const OrderbookHighlight = styled.span``;

export interface OrderbookItemProps {
  selected: boolean;
}

export const OrderbookItem = styled.div<OrderbookItemProps>`
  cursor: pointer;
  height: 20px;
  display: flex;
  justify-content: space-between;
  padding: 0 6px;
  line-height: 1.25rem;

  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }

  ${props =>
    props.selected &&
    css`
      background-color: rgba(0, 0, 0, 0.2);
    `}
`;

export const OrderbookMidprice = styled.div`
  width: 100%;
  text-align: center;
  background-color: black;
  padding: 6px;
  color: white;
`;

export interface OrderbookSideProps {
  side: 'bids' | 'asks';
}

export const OrderbookSide = styled.div<OrderbookSideProps>`
  flex: 1 1;

  ${props =>
    props.side === 'asks' &&
    css`
      ${OrderbookPrice} {
        color: darkred;
      }

      ${OrderbookHighlight} {
        color: red;
      }
    `}

  ${props =>
    props.side === 'bids' &&
    css`
      ${OrderbookPrice} {
        color: darkgreen;
      }

      ${OrderbookHighlight} {
        color: lime;
      }
    `}
`;
