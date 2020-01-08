import styled from 'styled-components';
import { NavLink } from '~/components/Common/Link/Link';

export const FundNavigation = styled.div`
  &::after {
    content: '.';
    clear: both;
    display: block;
    visibility: hidden;
    height: 0px;
  }
`;

export const FundNavigationPublic = styled.div`
  float: left;
`;

export const FundNavigationManager = styled.div`
  float: right;
`;

export const FundNavigationLink = styled(NavLink)`
  display: inline-block;
  position: relative;
  padding: 12px 32px;
  text-decoration: none;

  &.active::before {
    position: absolute;
    content: '';
    border-bottom: 2px solid ${props => props.theme.mainColors.primaryDark};
    bottom: -2px;
    right: 0;
    left: 0;
  }
`;
