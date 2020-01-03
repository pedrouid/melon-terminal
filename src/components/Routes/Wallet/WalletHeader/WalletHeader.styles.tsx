import styled from 'styled-components';

export const WalletHeader = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  flex-direction: column;

  @media (${props => props.theme.mediaQueries.m}) {
    flex-direction: row;
  }
`;

export const WalletHeaderHeadline = styled.div`
  padding-right: ${props => props.theme.spaceUnits.s};
`;

export const WalletHeaderLinks = styled.div`
  text-transform: uppercase;
  color: ${props => props.theme.otherColors.grey};
  font-size: ${props => props.theme.fontSizes.s};
`;
