import styled from 'styled-components';

const containerW = {
  s: '480px',
  m: '720px',
  l: '992px',
};

export const Container = styled.div`
  position: relative;
  display: block;
  width: 100%;
  margin: 0 auto;

  @media (${props => props.theme.mediaQueries.s}) {
    max-width: ${containerW.s};
  }

  @media (${props => props.theme.mediaQueries.m}) {
    max-width: ${containerW.m};
  }

  @media (${props => props.theme.mediaQueries.l}) {
    max-width: ${containerW.l};
  }
`;
