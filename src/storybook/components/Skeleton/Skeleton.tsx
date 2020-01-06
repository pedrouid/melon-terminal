import styled from 'styled-components';

export const Skeleton = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export const SkeletonHead = styled.div`
  flex: none;
  position: fixed;
  top: 0px;
  left:0px;
  z-index: 200;
  width:100%;
  height: ${props => props.theme.header.height};
`;

export const SkeletonBody = styled.div`
  position: relative;
  flex: 1 0 auto;
  width: 100%;
  padding: ${props => props.theme.header.height}$ 0px 0px;
  @media (${props => props.theme.mediaQueries.s}) {
    padding: ${props => props.theme.header.height}$ 0px 0px;
  }
`;

export const SkeletonFeet = styled.div`
  flex: none;
`;
