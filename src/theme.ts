import { createGlobalStyle } from 'styled-components';

export const theme = {
  mainColors: {
    primary: 'rgb(255, 255, 255)',
    primaryAlpha: 'rgba(255, 255, 255, 0.6)',
    primaryDark: 'rgb(29,29,29)',
    secondary: 'rgb(242, 242, 242)',
    secondaryDark: 'rgb(120, 120, 120)',
    secondaryDarkAlpha: 'rgb(196, 196, 196)',
    border: 'rgb(29, 29, 29)',
  },
  border: {
    borderDefault: '1px solid rgb(29,29,29)',
    borderSecondary: '1px solid rgb(196,196,196)',
    borderRadius: '0px',
    borderColor: 'rgb(29,29,29)',
  },
  statusColors: {
    primaryProfit: 'rgb(141, 197, 103)',
    secondaryProfit: 'rgb(243, 249, 241)',
    primaryLoss: 'rgb(206, 88, 102)',
    secondaryLoss: 'rgb(252, 240, 242)',
    warning: 'rgb(249,209,118)',
    neutral: 'rgb(96,213,255)',
  },
  otherColors: {
    black: 'rgb(0, 0, 0)',
    white: 'rgb(255, 255, 255)',
    grey: 'rgb(155, 155, 155)',
    red: 'rgb(244,67,54)',
    green: 'rgb(76,175,80)',
    logo: '#0B0B09',
  },
  spaceUnits: {
    xxxs: '2px',
    xxs: '4px',
    xs: '8px',
    s: '12px',
    m: '16px',
    l: '24px',
    xl: '32px',
    xxl: '40px',
    xxxl: '48px',
  },
  fontFamilies: {
    primary: '"Source Serif Pro", serif',
  },
  fontSizes: {
    xxl: '1.25rem',
    xl: '1.125rem',
    l: '1rem',
    m: '0.875rem',
    s: '0.75rem',
    xs: '0.625rem',
    xxs: '0.55rem',
  },
  fontWeights: {
    light: '300',
    regular: '400',
    semiBold: '600',
    bold: '700',
  },
  mediaQueries: {
    xl: 'min-width: 1440px',
    l: 'min-width: 1024px',
    m: 'min-width: 768px',
    s: 'min-width: 480px',
  },
  container: {
    xl: '1320px',
    l: '1180px',
    m: '992px',
    s: '720px',
  },
  skeleton: {
    headerHeight: '88px',
    footerHeight: '48px',
  },
  header: {
    height: '88px',
  },
  transition: {
    defaultAll: 'all 0.3s ease-in-out',
    duration: '0.3s',
  },
  awesomegrid: {
    mediaQuery: 'only screen',
    columns: {
      xs: 12,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 12,
    },
    gutterWidth: {
      xs: 1,
      sm: 1,
      md: 1,
      lg: 1.5,
      xl: 1.5,
    },
    paddingWidth: {
      xs: 0,
      sm: 0,
      md: 0,
      lg: 0,
      xl: 0,
    },
    container: {
      xs: 'full', // 'full' = max-width: 100%
      sm: 'full', // 'full' = max-width: 100%
      md: 'full', // 'full' = max-width: 100%
      lg: 'full', // 'full' = max-width: 100%
      xl: 'full', // 'full' = max-width: 100%
    },
    breakpoints: {
      xs: 1,
      sm: 48, // 768px
      md: 64, // 1024px
      lg: 90, // 1440px
      xl: 120, // 1920px
    },
  },
};

export const Global = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    min-height: 100%;
  }

  body {
    position: relative;
    font-family: 'Source Serif Pro', serif;
    font-size: 14px;
    line-height: 1.4;
    margin: 0;
    min-height: 100%;
    background-color: ${theme.mainColors.secondary};
  }

  h1, h2, h3 {
    margin-bottom: ${theme.spaceUnits.m};
    font-size: ${theme.fontSizes.xl};
    font-weight: bold;
    position: relative;
  }


  h2, h3 {
    padding-bottom: ${theme.spaceUnits.xs};
    border-bottom : ${theme.border.borderSecondary};
    margin-bottom: ${theme.spaceUnits.xs};
  }

  h4 {
    font-size: ${theme.fontSizes.l};
    margin-bottom: ${theme.spaceUnits.xs};
  }

  a {
    text-decoration: underline;
    color: ${theme.otherColors.black};
    transition: ${theme.transition.defaultAll};
    :hover{
      opacity: 0.6;
    }
  }

  hr {
    border: 0;
    height: 0;
    border-top: 1px solid ${theme.mainColors.border};
    margin: ${theme.spaceUnits.s} 0;
  }

  p {
    margin-bottom: ${theme.spaceUnits.m};
  }
`;
