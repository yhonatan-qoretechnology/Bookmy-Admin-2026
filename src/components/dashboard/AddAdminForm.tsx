import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2.25rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-top: 1rem;

  @media (max-width: 768px) {
    padding: 1.25rem;
  }
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
  column-gap: 1.75rem;
  row-gap: 2.25rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    column-gap: 0;
    row-gap: 1.75rem;
    margin-top: 1.25rem;
  }
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
  width: 95%;
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

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const EyeButton = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.25rem;
  color: #6b7280;

  &:hover {
    color: #374151;
  }

  &:focus {
    outline: none;
    color: #3b82f6;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
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
  role: string;
  photoFile?: File | null;
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

  const [sedes, setSedes] = useState<{ id: number; nombre: string }[]>([]);

  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (type === "company") {
      setFormData((prev) => ({
        ...prev,
        sedeId: undefined,
      }));
    }
  }, [type]);

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

  useEffect(() => {
    const fetchSedes = async () => {
      try {
        if (type !== "branch" || !formData.empresaId) {
          setSedes([]);
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/sedes/empresa/${formData.empresaId}`,
        );
        const data = await response.json();

        const nextSedes: { id: number; nombre: string }[] = Array.isArray(data)
          ? data
          : [];
        setSedes(nextSedes);

        if (nextSedes.length > 0) {
          const exists = nextSedes.some((s) => s.id === formData.sedeId);
          if (!exists) {
            setFormData((prev) => ({
              ...prev,
              sedeId: nextSedes[0].id,
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching sedes:", error);
        setSedes([]);
      }
    };

    fetchSedes();
  }, [type, formData.empresaId, formData.sedeId]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFormData((prev) => ({
      ...prev,
      photoFile: file,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    // Email validation regex (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Por favor ingresa un correo electrónico válido";
    }

    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es requerido";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido";
    }

    if (!formData.empresaId || formData.empresaId === 0) {
      newErrors.empresaId = "Debes seleccionar una empresa";
    }

    if (!formData.state.trim()) {
      newErrors.state = "Debes seleccionar un estado";
    }

    if (type === "branch") {
      if (!formData.sedeId || formData.sedeId === 0) {
        newErrors.sedeId = "Debes seleccionar una sede";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
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
          <Label htmlFor="email">Correo *</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Field>
        <Field>
          <Label htmlFor="password">Contraseña *</Label>
          <PasswordWrapper>
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
            />
            <EyeButton
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              {showPassword ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </EyeButton>
          </PasswordWrapper>
        </Field>
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
          {errors.firstName && <ErrorMessage>{errors.firstName}</ErrorMessage>}
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
          {errors.lastName && <ErrorMessage>{errors.lastName}</ErrorMessage>}
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
          <Label htmlFor="countryId">País</Label>
          <Select id="countryId" name="countryId" value={1} disabled>
            <option value={1}>España</option>
          </Select>
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
          <Label htmlFor="photoFile">Foto</Label>
          <Input
            type="file"
            id="photoFile"
            name="photoFile"
            accept="image/*"
            onChange={handleFileChange}
          />
        </Field>
        <Field>
          <Label htmlFor="empresaId">Empresa *</Label>
          <Select
            id="empresaId"
            name="empresaId"
            value={formData.empresaId}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar empresa</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.nombre}
              </option>
            ))}
          </Select>
          {errors.empresaId && <ErrorMessage>{errors.empresaId}</ErrorMessage>}
        </Field>
        {type === "branch" && (
          <Field>
            <Label htmlFor="sedeId">Sede *</Label>
            <Select
              id="sedeId"
              name="sedeId"
              value={formData.sedeId ?? ""}
              onChange={handleChange}
              disabled={!formData.empresaId}
              required
            >
              <option value="">
                {formData.empresaId
                  ? "Seleccionar sede"
                  : "Selecciona empresa primero"}
              </option>
              {sedes.map((sede) => (
                <option key={sede.id} value={sede.id}>
                  {sede.nombre}
                </option>
              ))}
            </Select>
            {errors.sedeId && <ErrorMessage>{errors.sedeId}</ErrorMessage>}
          </Field>
        )}
        <Field>
          <Label htmlFor="state">Estado *</Label>
          <Select
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
          >
            <option value="enabled">Habilitado</option>
            <option value="disabled">Deshabilitado</option>
          </Select>
          {errors.state && <ErrorMessage>{errors.state}</ErrorMessage>}
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
