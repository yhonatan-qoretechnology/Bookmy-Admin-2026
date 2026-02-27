import styled from 'styled-components';

export const AuthLayout = styled.main`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background-image:
    url('/login_bg.png'); 
  background-size: cover;
  background-position: center;

  &::before {
    content: '';
    position: absolute;
    z-index: 1;
    top: -150px;
    left: -200px;
    width: 900px;
    height: 900px;
    background-image: url('/blob-top-left.png');
    background-size: contain;
    background-repeat: no-repeat;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    z-index: 1;
    bottom: -500px;
    right: -50px;
    width: 900px;
    height: 900px;
    background-image: url('/blob-bottom-right.png');
    background-size: contain;
    background-repeat: no-repeat;
    pointer-events: none;
  }

  & > * {
    position: relative;
    z-index: 2;
  }

  @media (max-width: 768px) {
    &::before,
    &::after {
      display: none;
    }
  }
`;