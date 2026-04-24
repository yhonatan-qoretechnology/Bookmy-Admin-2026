import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: "Poppins", sans-serif;
  }

  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-family: "Poppins", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background 0.5s linear, color 0.5s linear;
  }

  #root {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  a {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
  }

  .poppins-regular {
    font-weight: 400;
  }

  .poppins-medium {
    font-weight: 500;
  }

  .poppins-semibold {
    font-weight: 600;
  }

  .poppins-bold {
    font-weight: 700;
  }
`;
