import styled from 'styled-components';
import { Container } from '~/storybook/components/Container/Container';
import { Title } from '~/storybook/components/Title/Title';

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
  padding: ${props => props.theme.spaceUnits.xs} 0px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;

export const ConnectionInfoItem = styled.div`
  margin-right: ${props => props.theme.spaceUnits.s};

  a {
    background: ${props => props.theme.mainColors.secondary};
    font-size: ${props => props.theme.fontSizes.s};
    text-transform: uppercase;
    text-decoration: none;
    padding: ${props => props.theme.spaceUnits.xs} ${props => props.theme.spaceUnits.s};
    display: inline-block;

    &.active {
      background: ${props => props.theme.mainColors.secondaryDarkAlpha};
    }

    &:hover {
      opacity: 1;
      background: ${props => props.theme.mainColors.secondaryDarkAlpha};
    }
  }
`;

export const HeaderTitle = styled(Title)`
  display: none;

  a {
    text-decoration: none;
  }

  @media (${props => props.theme.mediaQueries.m}) {
    display: block;
    margin-bottom: 0;
  }
`;
