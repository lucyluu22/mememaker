import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  :root {
    font-family: 'Helvetica Neue', 'Segoe UI', Helvetica, Arial, sans-serif;
    line-height: 1.5;

    color-scheme: ${props => props.theme.scheme};
    color: ${props => props.theme.colors.onPrimary};
    background-color: ${props => props.theme.colors.primary};

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  }

  html, body, #app {
    margin: 0;
    padding: 0;
    min-width: 480px;
    height: 100vh;
    overscroll-behavior: none;
  }
`
