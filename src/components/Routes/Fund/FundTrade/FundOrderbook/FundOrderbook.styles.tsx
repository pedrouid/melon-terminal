import styled, { css } from 'styled-components';
import { GridRow } from '~/storybook/components/Grid/Grid';


export interface OrderbookRowProps {
  selected: boolean;
  side: 'bids' | 'asks';
  key: string,
  onClick(): void,
}


export const OrderbookRow = styled(GridRow)<OrderbookRowProps>`

  &:hover {
    background-color: ${props => props.theme.orderbookColors.hover};
  }

  ${props =>
    props.side === 'asks' &&
    css`
      ${OrderbookPrice} {
        color: ${props.theme.orderbookColors.askDark};
      }

      ${OrderbookHighlight} {
        color: ${props.theme.orderbookColors.ask};
      }
    `}

  ${props =>
    props.side === 'bids' &&
    css`
      ${OrderbookPrice} {
        color: ${props.theme.orderbookColors.orderbook};
      }

      ${OrderbookHighlight} {
        color: ${props.theme.orderbookColors.orderbookLight};
      }
    `}
  ${props =>
    props.selected &&
    css`
      background-color: ${props.theme.orderbookColors.hover};
    `}
`;

export const OrderbookPrice = styled.span``;

export const OrderbookHighlight = styled.span``;





export const OrderbookMidprice = styled(GridRow)`
  background-color: ${props => props.theme.otherColors.white};
  color: ${props => props.theme.otherColors.black};
`;
