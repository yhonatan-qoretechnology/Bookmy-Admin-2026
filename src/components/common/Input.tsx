import styled from 'styled-components';
import React from 'react';

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledInput = styled.input<{ $hasIcon?: boolean }>`
  width: 100%;
  padding: 0.875rem;
  background: ${({ theme }) => theme.inputBg};
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 1rem;
  color: ${({ theme }) => theme.text};
  box-sizing: border-box;

  ${({ $hasIcon }) => $hasIcon && `padding-right: 3rem;`}

  &::placeholder {
    color: ${({ theme }) => theme.textLight};
  }
`;

const IconButton = styled.button`
  position: absolute;
  top: 50%;
  right: 0.75rem;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  
  &:hover {
    opacity: 0.8;
  }
`;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  onIconClick?: () => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ icon, onIconClick, ...props }, ref) => {
    return (
      <InputWrapper>
        <StyledInput 
          $hasIcon={!!icon}
          ref={ref} 
          {...props} 
        />
        {icon && (
          <IconButton type="button" onClick={onIconClick}>
            {icon}
          </IconButton>
        )}
      </InputWrapper>
    );
  }
);