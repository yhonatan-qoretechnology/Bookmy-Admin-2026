import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
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
  password: string;
  gender: "Masculino" | "Femenino";
  birthdate: string;
  firstName: string;
  lastName: string;
  categoryIds: string;
  fotoPerfil: File | null;
}

const Container = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-top: 1rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  &:nth-child(7),
  &:nth-child(8) {
    grid-column: 1 / -1;
  }
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
`;

const StyledInput = styled.input`
  padding: 0.65rem 0.85rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #374151;
  outline: none;
  transition: border 0.2s;

  &:focus {
    border-color: #66cdaa;
    background-color: white;
  }

  &::placeholder {
    color: #9ca3af;
  }

  &:disabled {
    background-color: #f3f4f6;
    color: #6b7280;
    cursor: not-allowed;
  }
`;

const StyledSelect = styled.select`
  padding: 0.65rem 0.85rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #374151;
  outline: none;
  cursor: pointer;
  transition: border 0.2s;

  &:focus {
    border-color: #66cdaa;
    background-color: white;
  }

  option {
    background: white;
    color: #374151;
  }
`;

const ErrorMessage = styled.span`
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.2rem;
`;

const Footer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

const ButtonBase = styled.button`
  padding: 0.65rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const BackButton = styled(ButtonBase)`
  background-color: #9ca3af;
  color: white;
  border: none;

  &:hover {
    background-color: #6b7280;
  }
`;

const SubmitButton = styled(ButtonBase)`
  background-color: #66cdaa;
  color: white;
  border: none;

  &:hover {
    background-color: #4eb892;
  }
`;

const FileUploadButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px dashed #9ca3af;
  background: #f9fafb;
  color: #6b7280;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #66cdaa;
    color: #66cdaa;
    background: #f0fdf4;
  }
`;

const ImagePreview = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #e5e7eb;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ImageUploadGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
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
    password: "",
    gender: "Masculino",
    birthdate: "1990-01-15",
    firstName: "",
    lastName: "",
    categoryIds: initialData?.categoryIds || "1,5,10",
    fotoPerfil: null,
  });

  const [errors, setErrors] = useState<Partial<ClientFormData>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fullName = useMemo(() => {
    return `${formData.firstName} ${formData.lastName}`
      .replace(/\s+/g, " ")
      .trim();
  }, [formData.firstName, formData.lastName]);

  useEffect(() => {
    if (formData.fotoPerfil) {
      const url = URL.createObjectURL(formData.fotoPerfil);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImagePreview(null);
    }
  }, [formData.fotoPerfil]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof ClientFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFormData((prev) => ({ ...prev, fotoPerfil: file }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ClientFormData> = {};

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
      newErrors.password = "Mínimo 6 caracteres";
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
      onSubmit({ ...formData, name: fullName || formData.name });
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
          <Label htmlFor="fullName">Nombre completo</Label>
          <StyledInput
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Se genera automáticamente"
            value={fullName}
            disabled
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="email">Email *</Label>
          <StyledInput
            id="email"
            name="email"
            type="email"
            placeholder="correo@email.com"
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
          <StyledSelect
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                gender: e.target.value as "Masculino" | "Femenino",
              }))
            }
          >
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </StyledSelect>
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
          <Label>Foto de perfil</Label>
          <ImageUploadGroup>
            <FileUploadButton
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              � Seleccionar
            </FileUploadButton>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            {imagePreview && (
              <ImagePreview>
                <img src={imagePreview} alt="Preview" />
              </ImagePreview>
            )}
          </ImageUploadGroup>
        </InputGroup>

        <Footer>
          <BackButton type="button" onClick={onBack}>
            Cancelar
          </BackButton>
          <SubmitButton type="submit">
            {isEditing ? "Actualizar" : "Crear Cliente"}
          </SubmitButton>
        </Footer>
      </Form>
    </Container>
  );
}
