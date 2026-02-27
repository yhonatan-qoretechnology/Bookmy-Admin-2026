import styled from 'styled-components';

export const Card = styled.div`
  background: ${({ theme }) => theme.cardBg};
  padding: 2.5rem; // Padding para escritorio
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 450px;
  box-sizing: border-box;

  /* ----- RESPONSIVE ----- */
  @media (max-width: 480px) {
    padding: 1.5rem; // Menos padding en móviles
  }
`;