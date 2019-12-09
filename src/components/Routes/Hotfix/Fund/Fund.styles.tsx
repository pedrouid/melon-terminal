import styled from 'styled-components';
import { PaddedBody, FullSubHeader, FullBody, FullNavigation } from '~/components/Common/Styles/Styles';

export const FundHeader = FullSubHeader;
export const FundBody = FullBody;
export const FundNavigation = FullNavigation;
export const FundNotFound = PaddedBody;

export const FundDetailsContent = styled.div`
  @media (${props => props.theme.mediaQueries.l}) {
    flex: 1;
    display: flex;
  }

  flex-direction: column;
`;

export const FundDetailsOrder = styled.div`
  @media (${props => props.theme.mediaQueries.l}) {
    display: flex;
    width: 100%;
    flex: 1;
  }

  border-top: 1px solid rgb(234, 229, 212);
`;

export const FundDetailsLists = styled.div`
  @media (${props => props.theme.mediaQueries.l}) {
    display: flex;
    width: 100%;
    flex: 1;
  }

  overflow: hidden;

  background-color: rgb(255, 255, 255);
  border-top: 1px solid rgb(234, 229, 212);
`;
