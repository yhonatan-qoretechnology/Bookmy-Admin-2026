import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  padding: 1rem;
  background: ${({ theme }) => (theme.body === '#121212' ? '#1f1f1f' : '#f0f0f0')};
  border-bottom: 1px solid ${({ theme }) => theme.text}20; // 20 es opacidad
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem; // Espacio entre enlaces

  a {
    font-size: 1.1rem;
    font-weight: bold;
  }
`;

export function Navbar() {
  return (
    <Nav>
      <NavLinks>
        <Link to="/">Inicio</Link>
        <Link to="/settings">Configuración</Link>
      </NavLinks>
    </Nav>
  );
}