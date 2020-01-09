import styled, { css } from 'styled-components';

const TitleBase = css`
  position: relative;
  margin-bottom: ${props => props.theme.spaceUnits.xs};
  font-weight: 600;
`;

export const Title = styled.h1`
  ${TitleBase}
  font-size: ${props => props.theme.fontSizes.xl};
  white-space: nowrap;
`;

export const SectionTitle = styled.h2`
  ${TitleBase}
  font-size: ${props => props.theme.fontSizes.xl};
  white-space: nowrap;
  padding-bottom: ${props => props.theme.spaceUnits.xs};
  border-bottom : ${props => props.theme.border.borderSecondary};
  margin-bottom: ${props => props.theme.spaceUnits.m};
`;
