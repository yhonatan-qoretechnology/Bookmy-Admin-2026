import styled from 'styled-components';

const Titulo = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.primary}; 
`;

export function HomePage() {
  return (
    <div>
      <Titulo>¡Bienvenido a la Página Principal!</Titulo>
      <p>Esta es la página de inicio de nuestra app.</p>
    </div>
  );
}