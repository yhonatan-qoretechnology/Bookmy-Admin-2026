import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-top: 1rem;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.textLight};
  font-size: 0.95rem;
  margin-bottom: 3rem;
`;

const OptionsContainer = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
`;

const OptionCard = styled.button<{ selected: boolean }>`
  background: ${({ selected }) => (selected ? "#f3f4f6" : "white")};
  border: 2px solid ${({ selected }) => (selected ? "#3b82f6" : "#e5e7eb")};
  border-radius: 12px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 200px;

  &:hover {
    border-color: #3b82f6;
    background: #f3f4f6;
  }

  h3 {
    font-size: 1.2rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.5rem;
  }

  p {
    color: ${({ theme }) => theme.textLight};
    font-size: 0.9rem;
  }
`;

const NextButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 2rem;

  &:hover {
    background: #2563eb;
  }

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
  }
`;

const BackButton = styled.button`
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  font-weight: 600;
  cursor: pointer;
  margin-right: 1rem;

  &:hover {
    background: #f9fafb;
  }
`;

interface AddAdminTypeProps {
  onBack: () => void;
  onNext: (type: "company" | "branch") => void;
}

export function AddAdminType({ onBack, onNext }: AddAdminTypeProps) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isCompanyAdmin = user.role === "COMPANY_ADMIN";

  const [selectedType, setSelectedType] = useState<"company" | "branch" | null>(
    isCompanyAdmin ? "branch" : null,
  );

  return (
    <Container>
      <Title>Seleccionar tipo de administrador</Title>
      <Subtitle>Elige el tipo de administrador que deseas crear</Subtitle>

      <OptionsContainer>
        {!isCompanyAdmin && (
          <OptionCard
            selected={selectedType === "company"}
            onClick={() => setSelectedType("company")}
          >
            <h3>Administrador de Empresa</h3>
            <p>Gestiona la empresa y puede crear administradores de sedes</p>
          </OptionCard>
        )}
        <OptionCard
          selected={selectedType === "branch"}
          onClick={() => setSelectedType("branch")}
        >
          <h3>Administrador de Sede</h3>
          <p>Gestiona una sede específica</p>
        </OptionCard>
      </OptionsContainer>

      <div>
        <BackButton onClick={onBack}>Atrás</BackButton>
        <NextButton
          disabled={!selectedType}
          onClick={() => selectedType && onNext(selectedType)}
        >
          Siguiente
        </NextButton>
      </div>
    </Container>
  );
}
