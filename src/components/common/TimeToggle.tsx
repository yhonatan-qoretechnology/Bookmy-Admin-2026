import React, { useState } from "react";
import styled from "styled-components";

const ToggleContainer = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: white;
  border: 1px solid #e5e7eb; 
  border-radius: 24px; 
  overflow: hidden; 
`;

const ToggleButton = styled.button<{ $isActive: boolean }>`
  background-color: ${({ $isActive }) => ($isActive ? "#70C1A6" : "white")};
  color: ${({ $isActive }) => ($isActive ? "white" : "#374151")};
  border: none;
  border-right: 1px solid #e5e7eb; 
  padding: 0.6rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:last-child {
    border-right: none;
  }

  &:hover {
    background-color: ${({ $isActive }) => ($isActive ? "#69C5A5" : "#f9fafb")};
  }
`;

interface TimeToggleProps {
  onChange?: (selected: string) => void; 
}

export function TimeToggle({ onChange }: TimeToggleProps) {
  const [activeTab, setActiveTab] = useState("Mes");
  
  const options = ["Dia", "Semana", "Mes"];

  const handleToggle = (option: string) => {
    setActiveTab(option);
    if (onChange) {
      onChange(option); 
    }
  };

  return (
    <ToggleContainer>
      {options.map((option) => (
        <ToggleButton
          key={option}
          $isActive={activeTab === option}
          onClick={() => handleToggle(option)}
        >
          {option}
        </ToggleButton>
      ))}
    </ToggleContainer>
  );
}