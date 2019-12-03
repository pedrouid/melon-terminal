import styled from 'styled-components';

export const FullSubHeader = styled.div`
  background-color: ${props => props.theme.mainColors.secondary};
  padding: ${props => props.theme.spaceUnits.s};
  border-bottom: 1px solid ${props => props.theme.mainColors.border};
`;

export const PaddedSubHeader = styled(FullSubHeader)`
  @media (${props => props.theme.mediaQueries.s}) {
    padding-left: 7%;
    padding-right: 7%;
  }
`;

export const FullBody = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 200px;

  @media (${props => props.theme.mediaQueries.l}) {
    flex: 1;
  }
`;

export const PaddedBody = styled(FullBody)`
  margin: ${props => props.theme.spaceUnits.xl} 0;

  @media (${props => props.theme.mediaQueries.s}) {
    padding-left: 7%;
    padding-right: 7%;
  }
`;

export const FullNavigation = styled.div`
  position: relative;
  border-bottom: 2px solid ${props => props.theme.mainColors.border};
`;

export const PaddedNavigation = styled(FullNavigation)`
  @media (${props => props.theme.mediaQueries.s}) {
    padding-left: 7%;
    padding-right: 7%;
  }
`;

export const PrimaryButton = styled.button`
  text-align: center;
  text-transform: uppercase;
  text-decoration: none;
  display: block;
  border: 1px solid 1px solid rgba(195, 179, 121, 0.75);
  background-color: rgba(195, 179, 121, 0.75);
  padding: ${props => props.theme.spaceUnits.s} ${props => props.theme.spaceUnits.m};

  &:hover {
    background-color: rgb(195, 179, 121);
  }
`;

export const Subtitle = styled.h3`
  margin: 12px;
  font-size: 1.125rem;
  position: relative;
`;
