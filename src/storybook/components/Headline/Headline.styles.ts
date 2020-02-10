import styled from 'styled-components';
import wallet from './wallet.jpg';
import fund from './fund.jpg';

export interface HeadlineIconProps {
  icon?: string;
}

export const Headline = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

export const HeadlineIcon = styled.div<HeadlineIconProps>`
  min-width: 50px;
  width: 50px;
  height: 50px;
  margin-right: ${props => props.theme.spaceUnits.s};
  background-image: ${props => (props.icon === 'wallet' ? `url(${wallet})` : `url(${fund})`)};
  background-position: center;
  background-repeat: no-repeat;
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
