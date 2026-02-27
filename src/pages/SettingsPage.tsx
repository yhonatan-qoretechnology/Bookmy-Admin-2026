import styled from 'styled-components';

const Titulo = styled.h1`
  font-size: 2.5rem;
`;

export function SettingsPage() {
  return (
    <div>
      <Titulo>Configuración</Titulo>
      <p>Aquí es donde cambiaremos el tema.</p>
    </div>
  );
}