import styled from 'styled-components';


export const Header = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${props => props.theme.skeleton.headerHeight};
  border-bottom: ${props => props.theme.border.borderDefault};
  background-color: ${props => props.theme.mainColors.primary};
  @media (${props => props.theme.mediaQueries.m}) {
    justify-content: flex-end;
  }
`;

export const LogoContainer = styled.div`
  position: relative;
  padding: 0px ${props => props.theme.spaceUnits.m};
  @media (${props => props.theme.mediaQueries.m}) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

export const Account = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${props => props.theme.spaceUnits.xs} ${props => props.theme.spaceUnits.m};
  font-size: ${props => props.theme.fontSizes.s};
  justify-content: center;

  @media (${props => props.theme.mediaQueries.m}) {
    flex: 1 0 auto;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
  }
`;

export const AccountName = styled.div`
  font-weight: ${props => props.theme.fontWeights.bold};
  font-size: ${props => props.theme.fontSizes.m};
  margin-bottom: ${props => props.theme.spaceUnits.xxs};

  @media (${props => props.theme.mediaQueries.m}) {
    margin-bottom: 0;
  }
`;

export const AccountInfo = styled.div``;

export const AccountInfoItem = styled.span`
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

export const AccountAddress = styled(AccountInfoItem)``;

export const AccountNetwork = styled(AccountInfoItem)``;

export const AccountBalance = styled(AccountInfoItem)``;
