import styled from 'styled-components';
import { NavLink } from '~/components/Common/Link/Link';

export const WalletNavigationLink = styled(NavLink)`
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
