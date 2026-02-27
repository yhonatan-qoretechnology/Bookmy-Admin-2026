import React, { useState, useEffect } from "react";
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

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 1.5rem;
  row-gap: 2.25rem;
  margin-top: 2rem;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  line-height: 1.25;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  line-height: 1.25;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  grid-column: 1 / -1;
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

const NextButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #2563eb;
  }

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
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

interface AddAdminFormProps {
  type: "company" | "branch";
  onBack: () => void;
  onNext: (data: AdminFormData) => void;
  isEditing?: boolean;
}

export function AddAdminForm({
  type,
  onBack,
  onNext,
  isEditing = false,
}: AddAdminFormProps) {
  const [formData, setFormData] = useState<AdminFormData>({
    email: "",
    password: "",
    phone: "",
    firstName: "",
    lastName: "",
    name: "",
    countryId: 1,
    idioma: "es",
    gender: "femenino",
    birthdate: "",
    empresaId: 1,
    sedeId: type === "branch" ? 1 : undefined,
    clientType: "business",
    state: "enabled",
    role: type === "company" ? "COMPANY_ADMIN" : "BRANCH_ADMIN",
  });

  const [companies, setCompanies] = useState<{ id: number; nombre: string }[]>(
    [],
  );

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/empresas`,
        );
        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    fetchCompanies();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "countryId" || name === "empresaId" || name === "sedeId"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation
    if (!formData.firstName || !formData.lastName) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }
    onNext(formData);
  };

  return (
    <Container>
      <Title>
        {isEditing ? "Editar" : "Crear"} Administrador{" "}
        {type === "company" ? "de Empresa" : "de Sede"}
      </Title>
      <Form onSubmit={handleSubmit}>
        <Field>
          <Label htmlFor="firstName">Nombre *</Label>
          <Input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </Field>
        <Field>
          <Label htmlFor="lastName">Apellido *</Label>
          <Input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </Field>
        <Field>
          <Label htmlFor="name">Nombre Completo</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </Field>
        <Field>
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </Field>
        <Field>
          <Label htmlFor="countryId">ID País</Label>
          <Input
            type="number"
            id="countryId"
            name="countryId"
            value={formData.countryId}
            onChange={handleChange}
          />
        </Field>
        <Field>
          <Label htmlFor="gender">Género</Label>
          <Select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="femenino">Femenino</option>
            <option value="masculino">Masculino</option>
          </Select>
        </Field>
        <Field>
          <Label htmlFor="birthdate">Fecha de Nacimiento</Label>
          <Input
            type="date"
            id="birthdate"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleChange}
          />
        </Field>
        <Field>
          <Label htmlFor="empresaId">Empresa</Label>
          <Select
            id="empresaId"
            name="empresaId"
            value={formData.empresaId}
            onChange={handleChange}
          >
            <option value="">Seleccionar empresa</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.nombre}
              </option>
            ))}
          </Select>
        </Field>
        {type === "branch" && (
          <Field>
            <Label htmlFor="sedeId">ID Sede</Label>
            <Input
              type="number"
              id="sedeId"
              name="sedeId"
              value={formData.sedeId}
              onChange={handleChange}
            />
          </Field>
        )}
        <Field>
          <Label htmlFor="state">Estado</Label>
          <Select
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
          >
            <option value="enabled">Habilitado</option>
            <option value="disabled">Deshabilitado</option>
          </Select>
        </Field>
        <ButtonContainer>
          <BackButton type="button" onClick={onBack}>
            Atrás
          </BackButton>
          <NextButton type="submit">Siguiente</NextButton>
        </ButtonContainer>
      </Form>
    </Container>
  );
}
