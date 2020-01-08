import styled, { css } from 'styled-components';
import { Bar, BarContent } from '../Bar/Bar';
import { NavLink } from '../Link/Link';

export const TabBar = styled(Bar)`
  padding: 0px;
`;

export const TabBarContent = styled(BarContent)``;

export const TabBarSection = styled.div``;

export const TabLink = styled(NavLink)`
    display: inline-block;
    position: relative;
    padding: ${props => props.theme.spaceUnits.m} ${props => props.theme.spaceUnits.xl};
    cursor: pointer;
    text-decoration: none;
    &::before{
      transition: ${props => props.theme.transition.defaultAll};
      position: absolute;
      content: '';
      bottom: -1px;
      right: 0;
      left: 0;
      width:100%;
    }
    :hover::before {
      border-bottom: 3px solid ${props => props.theme.mainColors.secondaryDarkAlpha};
    }
    &.active::before {
      border-bottom: 3px solid ${props => props.theme.mainColors.primaryDark};
    }
  }
`;
