import styled from 'styled-components';

export const Button = styled.button`
  width: 100%;
  padding: 0.875rem; 
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem; 
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #009e8c; 
  }
`;