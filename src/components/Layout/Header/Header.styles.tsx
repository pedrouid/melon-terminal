import styled from 'styled-components';
import { Logo as BaseLogo } from '~/components/Common/Logo/Logo';

export const HeaderPosition = styled.div`
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 200;
`;

export const Header = styled.div`
  border-bottom: 1px solid ${props => props.theme.mainColors.border};
  background-color: ${props => props.theme.mainColors.secondary};
  font-size: ${props => props.theme.fontSizes.s};
  line-height: 1;
  display: flex;
  flex-wrap: nowrap;

  @media (${props => props.theme.mediaQueries.m}) {
    justify-content: space-between;
  }
`;

export const Logo = styled(BaseLogo)``;

export const LogoContainer = styled.span`
  display: flex;
  align-items: center;
  padding: ${props => props.theme.spaceUnits.xs};
  border-right: 1px solid ${props => props.theme.mainColors.border};

  ${Logo} {
    display: none;

    @media (${props => props.theme.mediaQueries.s}) {
      display: inline-block;
    }
  }
`;

export const Account = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${props => props.theme.spaceUnits.xs} ${props => props.theme.spaceUnits.m};
  font-size: ${props => props.theme.fontSizes.s};
  justify-content: center;

  @media (${props => props.theme.mediaQueries.m}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
  }
`;

export const AccountInfo = styled.div``;

const AccountInfoItem = styled.span`
  text-transform: uppercase;

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
`;

export const AccountAddress = AccountInfoItem;

export const AccountFund = AccountInfoItem;

export const AccountNetwork = AccountInfoItem;

export const AccountBalance = AccountInfoItem;
