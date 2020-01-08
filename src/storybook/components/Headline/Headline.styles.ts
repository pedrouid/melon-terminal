import styled from 'styled-components';

export interface HeadlineIconProps {
  icon?: string;
}

export const Headline = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const HeadlineIcon = styled.div<HeadlineIconProps>`
  width: ${props => props.theme.spaceUnits.xxxl};
  height: ${props => props.theme.spaceUnits.xxxl};
  border: ${props => props.theme.border.borderDefault};
  border-radius: 50%;
  margin-right: ${props => props.theme.spaceUnits.s};
`;

export const HeadlineText = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
`;
export const HeadlineSideInfo = styled.div`
  margin-bottom: 0px;
  overflow: hidden;
  text-overflow: ellipsis;
`;
