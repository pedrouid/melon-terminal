import styled from 'styled-components';
import { Block } from '../Block/Block';

export interface DictionaryProps {
  entries?: {
    label: React.ReactNode;
    data: React.ReactNode;
  }[];
}

export const Dictionary = styled(Block) <DictionaryProps>``;

export const DictionaryDivider = styled.div`
  width: 100%;
  height: ${props => props.theme.spaceUnits.m};
  @media (${props => props.theme.mediaQueries.s}) {
    height: ${props => props.theme.spaceUnits.l};
  }
`;

export const DictionaryEntry = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-bottom: ${props => props.theme.spaceUnits.xs};
  @media (${props => props.theme.mediaQueries.s}) {
    flex-wrap: nowrap;
    margin-bottom: ${props => props.theme.spaceUnits.xxs};
  }
`;

export const DictionaryLabel = styled.div`
  align-self: flex-end;
  font-size: ${props => props.theme.fontSizes.m};
  color: ${props => props.theme.mainColors.secondaryDark};
  @media (${props => props.theme.mediaQueries.s}) {
    width: 30%;
  }
`;

export const DictionaryData = styled.div`
  align-self: flex-end;
  font-size: ${props => props.theme.fontSizes.l};
  width: 100%;
  @media (${props => props.theme.mediaQueries.s}) {
    width: 70%;
    padding-left: ${props => props.theme.spaceUnits.s};
  }
`;
