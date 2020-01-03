import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  position: relative;
  margin-bottom: ${props => props.theme.spaceUnits.xxl};
`;

export const OrderbookHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 ${props => props.theme.spaceUnits.s};
`;

export const OrderbookBody = styled.div`
  position: relative;
`;

export const OrderbookLabel = styled.span``;

export const OrderbookData = styled.span`
  font-size: ${props => props.theme.fontSizes.s};
`;

export const OrderbookItem = styled.div`
  cursor: pointer;
  height: 20px;
  padding: 0 ${props => props.theme.spaceUnits.s};
  display: flex;
  justify-content: space-between;

  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

export const OrderbookBarsWrapper = styled.div`
  overflow: visible;
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
`;

export const OrderbookBars = styled.svg`
  width: 100%;
  height: 100%;
  transform: scale(-1, 1);
  z-index: 0;
  pointer-events: none;
`;

export const OrderbookBar = styled.rect`
  height: 20px;
  fill-opacity: 0.2;
`;

export interface OrderbookSideProps {
  side: 'bids' | 'asks';
}

export const OrderbookSide = styled.div<OrderbookSideProps>`
  flex: 1 1;

  ${props =>
    props.side === 'asks' &&
    css`
      ${OrderbookBars} {
        transform: scale(1, 1);
      }

      ${OrderbookBar} {
        fill: red;
      }
    `}

  ${props =>
    props.side === 'bids' &&
    css`
      ${OrderbookBars} {
        transform: scale(-1, 1);
      }

      ${OrderbookBar} {
        fill: green;
      }
    `}
`;

export const Orderbook = styled.div`
  display: flex;
  justify-content: space-between;
`;
