import styled from 'styled-components';

export const FundHeader = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  flex-direction: column;

  @media (${props => props.theme.mediaQueries.m}) {
    flex-direction: row;
  }
`;

export const FundHeaderShutDown = styled.div`
  width: 100%;
  background: ${props => props.theme.statusColors.primaryLoss};
  padding: ${props => props.theme.spaceUnits.s};
  margin-bottom: ${props => props.theme.spaceUnits.s};
`;

// export const FundHeaderTitle = styled.h1`
//   margin: 0;
//   white-space: nowrap;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   max-width: 100%;

//   &::after {
//     border: none;
//   }
// `;

export const FundHeaderText = styled.div`
  margin-top: ${props => props.theme.spaceUnits.xs};
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const FundHeaderItemTitle = styled.div`
  color: ${props => props.theme.otherColors.grey};
  font-size: ${props => props.theme.fontSizes.s};
  margin-top: ${props => props.theme.spaceUnits.xs};

  @media (${props => props.theme.mediaQueries.m}) {
    margin-top: 0;
  }
`;

export const FundHeaderHeadline = styled.div`
  flex: 0 0 100%;
  padding-right: ${props => props.theme.spaceUnits.s};

  @media (${props => props.theme.mediaQueries.m}) {
    flex: 0 0 35%;
    max-width: 35%;
  }
`;

export const FundHeaderLinks = styled.div`
  text-transform: uppercase;
  color: ${props => props.theme.otherColors.grey};
  font-size: ${props => props.theme.fontSizes.s};
`;

export const FundHeaderInformation = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  flex: 0 0 65%;
`;

export const FundHeaderItem = styled.div`
  flex: 0 0 50%;
  padding: ${props => props.theme.spaceUnits.xs} ${props => props.theme.spaceUnits.xs} 0 0;

  @media (${props => props.theme.mediaQueries.s}) {
    flex: 0 0 33%;
  }
`;

export const FundHeaderActions = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const FundHeaderAction = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
