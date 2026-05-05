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
  existingPhotoUrl?: string | null;
  userRole?: string;
  clientId?: number;
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

const TabsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
`;

const Tab = styled.button<{ $isActive: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  background: ${({ $isActive }) => ($isActive ? "#66cdaa" : "transparent")};
  color: ${({ $isActive }) => ($isActive ? "white" : "#6b7280")};
  border-radius: 8px 8px 0 0;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ $isActive }) => ($isActive ? "#66cdaa" : "#f3f4f6")};
  }
`;

const PasswordSection = styled.div`
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  margin-top: 1rem;
`;

const PasswordInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  input {
    padding-right: 3rem;
  }
`;

const TogglePasswordButton = styled.button`
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;

  &:hover {
    color: #6366f1;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const SuccessMessage = styled.div`
  padding: 0.75rem;
  background: #dcfce7;
  color: #166534;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const ErrorText = styled.span`
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.2rem;
  display: block;
`;

export function CreateClientForm({
  onBack,
  onSubmit,
  isEditing = false,
  initialData,
  existingPhotoUrl,
  userRole,
  clientId,
}: CreateClientFormProps) {
  const isSuperAdmin = userRole === "SUPER_ADMIN";
  const [activeTab, setActiveTab] = useState<"datos" | "password">("datos");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChange = async () => {
    setPasswordError("");
    setPasswordSuccess(false);

    if (!newPassword || !confirmPassword) {
      setPasswordError("Todos los campos son obligatorios");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
      return;
    }

    if (!clientId) {
      setPasswordError("ID de cliente no disponible");
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/users/${clientId}/password/direct`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ newPassword }),
        },
      );

      if (response.ok) {
        setPasswordSuccess(true);
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const data = await response.json();
        setPasswordError(data.message || "Error al cambiar la contraseña");
      }
    } catch {
      setPasswordError("Error de conexión");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const [formData, setFormData] = useState<ClientFormData>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    password: "",
    gender: "Masculino",
    birthdate: "1990-01-15",
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
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
    } else if (existingPhotoUrl) {
      setImagePreview(existingPhotoUrl);
    } else {
      setImagePreview(null);
    }
  }, [formData.fotoPerfil, existingPhotoUrl]);

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

    // Only require password when creating new client (not editing)
    if (!isEditing && !formData.password.trim()) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (!isEditing && formData.password.length < 6) {
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

      {isEditing && isSuperAdmin && (
        <TabsContainer>
          <Tab
            $isActive={activeTab === "datos"}
            onClick={() => setActiveTab("datos")}
          >
            📋 Datos del Cliente
          </Tab>
          <Tab
            $isActive={activeTab === "password"}
            onClick={() => setActiveTab("password")}
          >
            🔒 Cambiar Contraseña
          </Tab>
        </TabsContainer>
      )}

      {activeTab === "password" && isSuperAdmin ? (
        <PasswordSection>
          {passwordSuccess && (
            <SuccessMessage>
              ✓ Contraseña actualizada correctamente
            </SuccessMessage>
          )}

          <InputGroup>
            <Label htmlFor="newPassword">Nueva Contraseña</Label>
            <PasswordInputWrapper>
              <StyledInput
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 6 caracteres"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <TogglePasswordButton
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </TogglePasswordButton>
            </PasswordInputWrapper>
          </InputGroup>

          <InputGroup style={{ marginTop: "1rem" }}>
            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
            <PasswordInputWrapper>
              <StyledInput
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <TogglePasswordButton
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </TogglePasswordButton>
            </PasswordInputWrapper>
          </InputGroup>

          {passwordError && <ErrorText>{passwordError}</ErrorText>}

          <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
            <SubmitButton
              type="button"
              onClick={handlePasswordChange}
              disabled={isChangingPassword}
            >
              {isChangingPassword ? "Cambiando..." : "Cambiar Contraseña"}
            </SubmitButton>
          </div>
        </PasswordSection>
      ) : (
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
            {errors.firstName && (
              <ErrorMessage>{errors.firstName}</ErrorMessage>
            )}
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
      )}
    </Container>
  );
}
