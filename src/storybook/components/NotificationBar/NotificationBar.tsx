import styled, { css } from 'styled-components';
import { Container } from '../Container/Container';

export interface NotificationBarProps {
  kind?: 'neutral' | 'warning' | 'error' | 'success';
  layout?: 'discrete';
  size?: 'small';
}

export const NotificationBar = styled.div<NotificationBarProps>`
   width: 100%;
   height: auto;
   padding: ${props => props.theme.spaceUnits.xs} 0px;
   color: ${props => props.theme.mainColors.primary};
   background: ${props => props.theme.statusColors.neutral};
   border-bottom: 2px solid;
   border-color: ${props => props.theme.statusColors.neutral};
   ${props =>
     props.kind === 'neutral' &&
     css`
       background: ${props => props.theme.statusColors.neutral};
       border-color: ${props => props.theme.statusColors.neutral};
     `}

   ${props =>
      props.kind === 'neutral' && props.layout === 'discrete' &&
      css`
        color: ${props => props.theme.statusColors.neutral};
        background: ${props => props.theme.mainColors.primaryAlpha};
      `}
   ${props =>
     props.kind === 'warning' &&
     css`
       background: ${props => props.theme.statusColors.warning};
       border-color: ${props => props.theme.statusColors.warning};
     `}
   ${props =>
      props.kind === 'warning' && props.layout === 'discrete' &&
      css`
        color: ${props => props.theme.statusColors.warning};
        background: ${props => props.theme.mainColors.primaryAlpha};
      `}
   ${props =>
     props.kind === 'error' &&
     css`
       background: ${props => props.theme.statusColors.primaryLoss};
       border-color: ${props => props.theme.statusColors.primaryLoss};
     `}
   ${props =>
      props.kind === 'error' && props.layout === 'discrete' &&
      css`
        color: ${props => props.theme.statusColors.primaryLoss};
        background: ${props => props.theme.mainColors.primaryAlpha};
      `}
   ${props =>
     props.kind === 'success' &&
     css`
       background: ${props => props.theme.statusColors.primaryProfit};
       border-color: ${props => props.theme.statusColors.primaryProfit};
     `}
     ${props =>
        props.kind === 'success' && props.layout === 'discrete' &&
        css`
          color: ${props => props.theme.statusColors.primaryProfit};
          background: ${props => props.theme.mainColors.primaryAlpha};
        `}
     ${props =>
       props.size === 'small' &&
       css`
         width: calc(${props => props.theme.spaceUnits.xxxl}*10);
         margin: 0px auto;
       `}
     ${props =>
         props.size === 'small' && props.layout === 'discrete' &&
        css`
          border-left: 2px solid;
          border-right: 2px solid;
          borderColor: inherit
        `}
`

export const NotificationContent = styled(Container)`
   text-align: center;
`
