import React from "react";
import styled from "styled-components";

const Container = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-top: 1rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const Summary = styled.div`
  margin: 2rem 0;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;

  &:last-child {
    margin-bottom: 0;
  }

  strong {
    color: #374151;
  }

  span {
    color: #6b7280;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const BackButton = styled.button`
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #f9fafb;
  }
`;

const ConfirmButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #059669;
  }
`;

interface AdminFormData {
  email: string;
  password: string;
  phone: string;
  firstName: string;
  lastName: string;
  name: string;
  countryId: number;
  idioma: string;
  gender: string;
  birthdate: string;
  empresaId: number;
  sedeId?: number;
  clientType: string;
  state: string;
}

interface AddAdminConfirmProps {
  type: "company" | "branch";
  data: AdminFormData;
  onBack: () => void;
  onConfirm: () => void;
  isEditing?: boolean;
}

export function AddAdminConfirm({
  type,
  data,
  onBack,
  onConfirm,
}: AddAdminConfirmProps) {
  return (
    <Container>
      <Title>Confirmar Creación de Administrador</Title>
      <Summary>
        <SummaryItem>
          <strong>Tipo:</strong>
          <span>
            {type === "company"
              ? "Administrador de Empresa"
              : "Administrador de Sede"}
          </span>
        </SummaryItem>
        <SummaryItem>
          <strong>Email:</strong>
          <span>{data.email}</span>
        </SummaryItem>
        <SummaryItem>
          <strong>Nombre:</strong>
          <span>
            {data.firstName} {data.lastName}
          </span>
        </SummaryItem>
        <SummaryItem>
          <strong>Teléfono:</strong>
          <span>{data.phone || "No especificado"}</span>
        </SummaryItem>
        <SummaryItem>
          <strong>País:</strong>
          <span>{data.countryId}</span>
        </SummaryItem>
        <SummaryItem>
          <strong>Idioma:</strong>
          <span>{data.idioma === "es" ? "Español" : "Inglés"}</span>
        </SummaryItem>
        <SummaryItem>
          <strong>Género:</strong>
          <span>{data.gender === "femenino" ? "Femenino" : "Masculino"}</span>
        </SummaryItem>
        <SummaryItem>
          <strong>Fecha de Nacimiento:</strong>
          <span>{data.birthdate || "No especificada"}</span>
        </SummaryItem>
        <SummaryItem>
          <strong>ID Empresa:</strong>
          <span>{data.empresaId}</span>
        </SummaryItem>
        {data.sedeId && (
          <SummaryItem>
            <strong>ID Sede:</strong>
            <span>{data.sedeId}</span>
          </SummaryItem>
        )}
        <SummaryItem>
          <strong>Tipo de Cliente:</strong>
          <span>
            {data.clientType === "business" ? "Business" : "Individual"}
          </span>
        </SummaryItem>
        <SummaryItem>
          <strong>Estado:</strong>
          <span>
            {data.state === "enabled" ? "Habilitado" : "Deshabilitado"}
          </span>
        </SummaryItem>
      </Summary>
      <ButtonContainer>
        <BackButton onClick={onBack}>Atrás</BackButton>
        <ConfirmButton onClick={onConfirm}>Crear Administrador</ConfirmButton>
      </ButtonContainer>
    </Container>
  );
}
