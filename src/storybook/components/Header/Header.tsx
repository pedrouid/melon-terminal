import styled from 'styled-components';
import { Container } from '../Container/Container';

export const Header = styled.div`
  position: relative;
  width: 100%;
  border-bottom: ${props => props.theme.border.borderDefault};
  background-color: ${props => props.theme.mainColors.primary};
`;

export const HeaderContent = styled(Container)`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${props => props.theme.skeleton.headerHeight};
`;

export const LogoContainer = styled.div`
  position: relative;
  padding: 0px ${props => props.theme.spaceUnits.m};
  @media (${props => props.theme.mediaQueries.l}) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

export const ConnectionInfo = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${props => props.theme.spaceUnits.xs} 0px;
  font-size: ${props => props.theme.fontSizes.s};
  justify-content: center;

  @media (${props => props.theme.mediaQueries.m}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
  }
`;

export const ConnectionInfoItem = styled.div`
  text-transform: uppercase;

  @media (${props => props.theme.mediaQueries.m}) {
    &::before {
      content: '|';
      margin-right: ${props => props.theme.spaceUnits.xxs};
      padding-left: ${props => props.theme.spaceUnits.xxs};
      color: ${props => props.theme.otherColors.grey};
    }

    &:first-child::before {
      content: '';
      margin-right: 0;
      padding-left: 0;
    }
  }
`;
