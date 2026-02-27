import styled from 'styled-components';
import checkIcon from '../../assets/icons/check.svg'; 

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.textLight};
  font-weight: 500;
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
`;

const StyledCheckbox = styled.div<{ $checked: boolean }>`
  width: 18px;
  height: 18px;
  border: 1px solid ${({ theme, $checked }) => ($checked ? theme.primary : '#D1D5DB')};
  background: ${({ theme, $checked }) => ($checked ? theme.primary : theme.inputBg)};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  img {
    width: 12px;
    height: 12px;
    display: ${({ $checked }) => ($checked ? 'block' : 'none')};
  }
`;

interface CheckboxProps {
  children: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Checkbox({ children, checked, onChange }: CheckboxProps) {
  return (
    <CheckboxContainer>
      <HiddenCheckbox 
        checked={checked} 
        onChange={(e) => onChange(e.target.checked)} 
      />
      <StyledCheckbox $checked={checked}>
        <img src={checkIcon} alt="checked" />
      </StyledCheckbox>
      <span>{children}</span>
    </CheckboxContainer>
  );
}