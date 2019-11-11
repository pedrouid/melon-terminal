import styled from 'styled-components';

export const ButtonBlockWrapper = styled.div`
  margin-top: ${props => props.theme.spaceUnits.m};
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

export const ButtonBlockButtonWrapper = styled.div`
  display: block;
  flex: 0 0 40%;
`;
