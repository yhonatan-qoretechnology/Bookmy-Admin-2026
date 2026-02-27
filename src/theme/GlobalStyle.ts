import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-family: Tahoma, Helvetica, Arial, Roboto, sans-serif;
    transition: background 0.5s linear, color 0.5s linear;
  }

  a {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
  }
`;