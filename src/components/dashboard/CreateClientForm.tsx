import { useState, type ChangeEvent, type FormEvent } from "react";
import styled from "styled-components";

interface CreateClientFormProps {
  onBack: () => void;
  onSubmit: (data: ClientFormData) => void;
  isEditing?: boolean;
  initialData?: Partial<ClientFormData>;
}

export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  document: string;
  password: string;
  gender: "Masculino" | "Femenino";
  birthdate: string;
  firstName: string;
  lastName: string;
}

const Container = styled.div`
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-top: 1rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 2rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textLight};
`;

const StyledInput = styled.input`
  padding: 0.8rem 1rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.text};
  outline: none;
  transition: border 0.2s;

  &:focus {
    border-color: #66cdaa;
    background-color: white;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const ErrorMessage = styled.span`
  font-size: 0.8rem;
  color: #ef4444;
  margin-top: 0.25rem;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  border-top: 1px solid #f3f4f6;
  padding-top: 2rem;
`;

const ButtonBase = styled.button`
  padding: 0.8rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.9;
  }
`;

const BackButton = styled(ButtonBase)`
  background-color: #9ca3af;
  color: white;
  border: none;
`;

const SubmitButton = styled(ButtonBase)`
  background-color: #66cdaa;
  color: white;
  border: none;
`;

export function CreateClientForm({
  onBack,
  onSubmit,
  isEditing = false,
  initialData,
}: CreateClientFormProps) {
  const [formData, setFormData] = useState<ClientFormData>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    document: initialData?.document || "",
    password: "",
    gender: "Masculino",
    birthdate: "1990-01-15",
    firstName: "",
    lastName: "",
  });

  const [errors, setErrors] = useState<Partial<ClientFormData>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof ClientFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ClientFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es obligatorio";
    }

    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es obligatorio";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "El apellido es obligatorio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Container>
      <SectionTitle>
        {isEditing ? "Editar Cliente" : "Crear Nuevo Cliente"}
      </SectionTitle>

      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="firstName">Nombre *</Label>
          <StyledInput
            id="firstName"
            name="firstName"
            type="text"
            placeholder="Nombre"
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && <ErrorMessage>{errors.firstName}</ErrorMessage>}
        </InputGroup>

        <InputGroup>
          <Label htmlFor="lastName">Apellido *</Label>
          <StyledInput
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Apellido"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <ErrorMessage>{errors.lastName}</ErrorMessage>}
        </InputGroup>

        <InputGroup>
          <Label htmlFor="name">Nombre completo *</Label>
          <StyledInput
            id="name"
            name="name"
            type="text"
            placeholder="Ingrese el nombre completo"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
        </InputGroup>

        <InputGroup>
          <Label htmlFor="email">Email *</Label>
          <StyledInput
            id="email"
            name="email"
            type="email"
            placeholder="cliente@email.com"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        </InputGroup>

        <InputGroup>
          <Label htmlFor="phone">Teléfono *</Label>
          <StyledInput
            id="phone"
            name="phone"
            type="tel"
            placeholder="+34 600 000 000"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
        </InputGroup>

        <InputGroup>
          <Label htmlFor="password">Contraseña *</Label>
          <StyledInput
            id="password"
            name="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
        </InputGroup>

        <InputGroup>
          <Label htmlFor="gender">Género *</Label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                gender: e.target.value as "Masculino" | "Femenino",
              }))
            }
            style={{
              padding: "0.8rem 1rem",
              backgroundColor: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              fontSize: "0.95rem",
              color: "#374151",
              outline: "none",
            }}
          >
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
        </InputGroup>

        <InputGroup>
          <Label htmlFor="birthdate">Fecha de nacimiento *</Label>
          <StyledInput
            id="birthdate"
            name="birthdate"
            type="date"
            value={formData.birthdate}
            onChange={handleChange}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="document">Documento de identidad *</Label>
          <StyledInput
            id="document"
            name="document"
            type="text"
            placeholder="12345678A"
            value={formData.document}
            onChange={handleChange}
          />
          {errors.document && <ErrorMessage>{errors.document}</ErrorMessage>}
        </InputGroup>

        <Footer>
          <BackButton type="button" onClick={onBack}>
            Cancelar
          </BackButton>
          <SubmitButton type="submit">
            {isEditing ? "Actualizar Cliente" : "Crear Cliente"}
          </SubmitButton>
        </Footer>
      </Form>
    </Container>
  );
}
