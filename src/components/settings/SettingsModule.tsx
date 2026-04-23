import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { FetchHttpClient } from "../../api/http/FetchHttpClient";
import { AdminApiClient } from "../../api/clients/AdminApiClient";
import type { Admin } from "../../core/domain/admin/AdminTypes";

const Container = styled.div`
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 0.95rem;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: #f1f5f9;
  padding: 0.5rem;
  border-radius: 12px;
  width: fit-content;
`;

const Tab = styled.button<{ $isActive: boolean }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
  background: ${({ $isActive }) => ($isActive ? "white" : "transparent")};
  color: ${({ $isActive }) => ($isActive ? "#6366f1" : "#64748b")};
  box-shadow: ${({ $isActive }) =>
    $isActive ? "0 2px 8px rgba(99, 102, 241, 0.15)" : "none"};

  &:hover {
    color: ${({ $isActive }) => ($isActive ? "#6366f1" : "#334155")};
  }
`;

const SecondaryButton = styled.button`
  padding: 0.875rem 2rem;
  background: white;
  color: #334155;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    border-color: #cbd5e1;
    background: #f8fafc;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-top: 2rem;
  margin-bottom: 2rem;
  padding: 0 0.5rem;
`;

const ContentCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;
`;

const AvatarWrapper = styled.div`
  position: relative;
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 600;
  color: white;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
`;

const RoleBadge = styled.span`
  position: absolute;
  bottom: 0;
  right: 0;
  background: #10b981;
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  text-transform: uppercase;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
`;

const ProfileEmail = styled.p`
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const ProfileRole = styled.span`
  display: inline-block;
  background: #f1f5f9;
  color: #6366f1;
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2.5rem;
  padding: 1rem 0.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const InfoLabel = styled.span`
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.span`
  font-size: 1rem;
  color: #1e293b;
  font-weight: 500;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.2s ease;
  margin-top: 0.5rem;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const Button = styled.button`
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.35);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorText = styled.p`
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 0.5rem;
`;

const SuccessMessage = styled.div`
  background: #d1fae5;
  color: #065f46;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

type TabType = "perfil" | "seguridad";

const getRoleLabel = (role: string): string => {
  switch (role) {
    case "SUPER_ADMIN":
      return "Super Administrador";
    case "COMPANY_ADMIN":
      return "Administrador de Empresa";
    case "BRANCH_ADMIN":
      return "Administrador de Sede";
    default:
      return role;
  }
};

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function SettingsModule() {
  const [activeTab, setActiveTab] = useState<TabType>("perfil");

  const rawAccessToken = localStorage.getItem("accessToken");
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const hasSession = !!rawAccessToken;

  const storedUserId: number | null = (() => {
    if (storedUser?.id === undefined || storedUser?.id === null) return null;
    const asNumber = Number(storedUser.id);
    return Number.isFinite(asNumber) ? asNumber : null;
  })();

  const httpClient = useMemo(() => new FetchHttpClient(), []);
  const adminApiClient = useMemo(
    () => new AdminApiClient(httpClient),
    [httpClient],
  );

  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string>("");
  const [profileSuccess, setProfileSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!storedUserId) return;
      setIsLoadingProfile(true);
      setProfileError("");
      try {
        const data = await adminApiClient.getAdminById(storedUserId);
        if (data && data.id) {
          setAdmin(data);
          localStorage.setItem("user", JSON.stringify(data));
        }
      } catch {
        setProfileError("No se pudo cargar el perfil");
      } finally {
        setIsLoadingProfile(false);
      }
    };
    void load();
  }, [adminApiClient, storedUserId]);

  const effectiveUser = admin ?? storedUser;

  const userName =
    effectiveUser?.UserData?.name ||
    `${effectiveUser?.AdminProfile?.firstName || ""} ${effectiveUser?.AdminProfile?.lastName || ""}`.trim() ||
    effectiveUser?.name ||
    "Usuario";
  const userEmail = effectiveUser?.email || "";
  const userRole = effectiveUser?.role || storedUser?.role || "";

  const [editName, setEditName] = useState("");
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  useEffect(() => {
    setEditName(effectiveUser?.UserData?.name || effectiveUser?.name || "");
    setEditFirstName(effectiveUser?.AdminProfile?.firstName || "");
    setEditLastName(effectiveUser?.AdminProfile?.lastName || "");
    setEditPhone(
      effectiveUser?.AdminProfile?.phone ||
        effectiveUser?.UserData?.phone ||
        "",
    );
  }, [effectiveUser]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handlePasswordChange = async () => {
    setPasswordError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Todos los campos son obligatorios");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        },
      );

      if (response.ok) {
        setPasswordSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordSuccess(false), 5000);
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

  const handleRefreshProfile = async () => {
    if (!storedUserId) return;
    setIsLoadingProfile(true);
    setProfileError("");
    try {
      const data = await adminApiClient.getAdminById(storedUserId);
      if (data && data.id) {
        setAdmin(data);
        localStorage.setItem("user", JSON.stringify(data));
      }
    } catch {
      setProfileError("No se pudo refrescar el perfil");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!storedUserId) return;
    setProfileError("");
    setProfileSuccess(false);
    setIsSavingProfile(true);
    try {
      const formData = new FormData();

      if (editName) formData.append("name", editName);
      if (editFirstName) formData.append("firstName", editFirstName);
      if (editLastName) formData.append("lastName", editLastName);
      if (editPhone) formData.append("phone", editPhone);

      const response = await adminApiClient.updateAdmin(storedUserId, formData);
      const updated = (response as unknown as { user?: Admin }).user;

      if (updated && updated.id) {
        setAdmin(updated);
        localStorage.setItem("user", JSON.stringify(updated));
      } else {
        const data = await adminApiClient.getAdminById(storedUserId);
        if (data && data.id) {
          setAdmin(data);
          localStorage.setItem("user", JSON.stringify(data));
        }
      }

      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 4000);
    } catch {
      setProfileError("No se pudo guardar la información");
    } finally {
      setIsSavingProfile(false);
    }
  };

  if (!hasSession) {
    return (
      <Container>
        <Header>
          <Title>Configuración</Title>
          <Subtitle>
            No se encontró una sesión activa. Por favor, inicia sesión
            nuevamente.
          </Subtitle>
        </Header>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Configuración</Title>
        <Subtitle>Administra tu perfil y seguridad de tu cuenta</Subtitle>
      </Header>

      <TabsContainer>
        <Tab
          $isActive={activeTab === "perfil"}
          onClick={() => setActiveTab("perfil")}
        >
          👤 Mi Perfil
        </Tab>
        <Tab
          $isActive={activeTab === "seguridad"}
          onClick={() => setActiveTab("seguridad")}
        >
          🔒 Seguridad
        </Tab>
      </TabsContainer>

      <ContentCard>
        {activeTab === "perfil" && (
          <>
            <ProfileSection>
              <AvatarWrapper>
                <Avatar>{getInitials(userName)}</Avatar>
                <RoleBadge>{getRoleLabel(userRole)}</RoleBadge>
              </AvatarWrapper>
              <ProfileInfo>
                <ProfileName>{userName}</ProfileName>
                <ProfileEmail>{userEmail}</ProfileEmail>
                <ProfileRole>{getRoleLabel(userRole)}</ProfileRole>
              </ProfileInfo>
            </ProfileSection>

            {isLoadingProfile && (
              <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>
                Cargando datos...
              </p>
            )}

            {profileSuccess && (
              <SuccessMessage>✓ Información actualizada</SuccessMessage>
            )}

            {profileError && <ErrorText>{profileError}</ErrorText>}

            <InfoGrid>
              <InfoItem>
                <InfoLabel>Nombre (Usuario)</InfoLabel>
                <Input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </InfoItem>
              <InfoItem>
                <InfoLabel>Nombre (Admin)</InfoLabel>
                <Input
                  type="text"
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                />
              </InfoItem>
              <InfoItem>
                <InfoLabel>Apellido (Admin)</InfoLabel>
                <Input
                  type="text"
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                />
              </InfoItem>
              <InfoItem>
                <InfoLabel>Teléfono</InfoLabel>
                <Input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                />
              </InfoItem>
            </InfoGrid>

            <ButtonRow>
              <Button onClick={handleSaveProfile} disabled={isSavingProfile}>
                {isSavingProfile ? "Guardando..." : "Guardar cambios"}
              </Button>
              <SecondaryButton
                onClick={handleRefreshProfile}
                type="button"
                disabled={isLoadingProfile}
              >
                {isLoadingProfile ? "Actualizando..." : "Refrescar"}
              </SecondaryButton>
            </ButtonRow>

            <InfoGrid
              style={{
                marginTop: "3rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid #e2e8f0",
              }}
            >
              <InfoItem>
                <InfoLabel>ID de Usuario</InfoLabel>
                <InfoValue>#{effectiveUser?.id || "N/A"}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Rol</InfoLabel>
                <InfoValue>{getRoleLabel(userRole)}</InfoValue>
              </InfoItem>
              {effectiveUser?.state && (
                <InfoItem>
                  <InfoLabel>Estado</InfoLabel>
                  <InfoValue>{effectiveUser.state}</InfoValue>
                </InfoItem>
              )}
              {effectiveUser?.clientType && (
                <InfoItem>
                  <InfoLabel>Tipo Cliente</InfoLabel>
                  <InfoValue>{effectiveUser.clientType}</InfoValue>
                </InfoItem>
              )}
              {effectiveUser?.AdminProfile?.empresaId && (
                <InfoItem>
                  <InfoLabel>ID Empresa</InfoLabel>
                  <InfoValue>{effectiveUser.AdminProfile.empresaId}</InfoValue>
                </InfoItem>
              )}
              {effectiveUser?.AdminProfile?.sedeId && (
                <InfoItem>
                  <InfoLabel>ID Sede</InfoLabel>
                  <InfoValue>{effectiveUser.AdminProfile.sedeId}</InfoValue>
                </InfoItem>
              )}
              {effectiveUser?.UserData?.idioma && (
                <InfoItem>
                  <InfoLabel>Idioma</InfoLabel>
                  <InfoValue>{effectiveUser.UserData.idioma}</InfoValue>
                </InfoItem>
              )}
              {effectiveUser?.UserData?.gender && (
                <InfoItem>
                  <InfoLabel>Género</InfoLabel>
                  <InfoValue>{effectiveUser.UserData.gender}</InfoValue>
                </InfoItem>
              )}
              {effectiveUser?.UserData?.birthdate && (
                <InfoItem>
                  <InfoLabel>Fecha Nacimiento</InfoLabel>
                  <InfoValue>{effectiveUser.UserData.birthdate}</InfoValue>
                </InfoItem>
              )}
            </InfoGrid>
          </>
        )}

        {activeTab === "seguridad" && (
          <>
            {passwordSuccess && (
              <SuccessMessage>
                ✓ Contraseña cambiada exitosamente
              </SuccessMessage>
            )}

            <FormGroup>
              <Label>Contraseña Actual</Label>
              <Input
                type="password"
                placeholder="Ingresa tu contraseña actual"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Nueva Contraseña</Label>
              <Input
                type="password"
                placeholder="Ingresa tu nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Confirmar Nueva Contraseña</Label>
              <Input
                type="password"
                placeholder="Confirma tu nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormGroup>

            {passwordError && <ErrorText>{passwordError}</ErrorText>}

            <Button
              onClick={handlePasswordChange}
              disabled={isChangingPassword}
            >
              {isChangingPassword ? "Cambiando..." : "Cambiar Contraseña"}
            </Button>
          </>
        )}
      </ContentCard>
    </Container>
  );
}
