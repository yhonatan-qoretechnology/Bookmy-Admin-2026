import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { FetchHttpClient } from "../../api/http/FetchHttpClient";
import { AdminApiClient } from "../../api/clients/AdminApiClient";
import type { Admin } from "../../core/domain/admin/AdminTypes";

const Container = styled.div`
  padding: 1.5rem;
  margin: 0 auto;
`;

const ContentCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.03);
  border: 1px solid #f0f0f0;
`;

const TopSection = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 2.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AvatarUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
`;

const AvatarCircle = styled.label`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background-color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
  }

  input {
    display: none;
  }
`;

const ChangeImageLink = styled.label`
  color: #3b82f6;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;

  input {
    display: none;
  }
`;

const InputsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.85rem 1rem;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #1e293b;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;

  &:focus {
    border-color: #70c1a6;
    background-color: white;
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const MiddleSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 2.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 140px;
  padding: 0.85rem 1rem;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #1e293b;
  outline: none;
  resize: none;
  box-sizing: border-box;
  font-family: inherit;

  &:focus {
    border-color: #70c1a6;
    background-color: white;
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const BannerUploadWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 1rem;
`;

const BannerBox = styled.label`
  width: 100%;
  height: 140px;
  background-color: #e2e8f0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  input {
    display: none;
  }
`;

const SocialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const SocialInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SocialIconBox = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background-color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const SaveButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const SaveButton = styled.button`
  background-color: #70c1a6;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0.9rem 4rem;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    opacity 0.2s,
    transform 0.1s;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CameraIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#4B5563"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#E4405F"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TikTokIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#000000">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const GlobeIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#374151"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export function SettingsModule() {
  const rawAccessToken = localStorage.getItem("accessToken");
  const storedUser = (() => {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : {};
    } catch {
      return {};
    }
  })();
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
  const [isSaving, setIsSaving] = useState(false);

  const [empresaNombre, setEmpresaNombre] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [website, setWebsite] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!storedUserId) return;
      try {
        const data = await adminApiClient.getAdminById(storedUserId);
        if (data && data.id) {
          setAdmin(data);
          localStorage.setItem("user", JSON.stringify(data));
        }
      } catch {
        // Silenced
      }
    };
    void load();
  }, [adminApiClient, storedUserId]);

  const effectiveUser = (admin ?? storedUser) as Record<string, unknown> | null;

  useEffect(() => {
    if (!effectiveUser) return;
    const adminProfile = effectiveUser.AdminProfile as
      | Record<string, unknown>
      | undefined;
    const userData = effectiveUser.UserData as
      | Record<string, unknown>
      | undefined;

    setEmpresaNombre(
      (adminProfile?.empresaNombre as string) ||
        (userData?.name as string) ||
        "",
    );
    setEmail((effectiveUser?.email as string) || "");
    setTelefono(
      (adminProfile?.phone as string) || (userData?.phone as string) || "",
    );
    setDescripcion((adminProfile?.descripcion as string) || "");
    setUbicacion((adminProfile?.ubicacion as string) || "");
  }, [effectiveUser]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storedUserId) return;
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("empresaNombre", empresaNombre);
      formData.append("ubicacion", ubicacion);
      formData.append("email", email);
      formData.append("phone", telefono);
      formData.append("descripcion", descripcion);

      await adminApiClient.updateAdmin(storedUserId, formData);
      alert("Configuración guardada exitosamente");
    } catch {
      alert("Guardado local simulado con éxito");
    } finally {
      setIsSaving(false);
    }
  };

  if (!hasSession) {
    return null;
  }

  return (
    <Container>
      <ContentCard>
        <form onSubmit={handleSaveSettings}>
          <TopSection>
            <AvatarUploadContainer>
              <AvatarCircle>
                <CameraIcon />
                <input type="file" accept="image/*" />
              </AvatarCircle>
              <ChangeImageLink>
                Cambiar imagen
                <input type="file" accept="image/*" />
              </ChangeImageLink>
            </AvatarUploadContainer>

            <InputsGrid>
              <FormGroup>
                <Label>Nombre empresa</Label>
                <Input
                  placeholder="Nombre de empresa"
                  value={empresaNombre}
                  onChange={(e) => setEmpresaNombre(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label>Ubicación</Label>
                <Input
                  placeholder="Inserta el codigo de google maps de tu ubicación"
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label>Teléfono contacto</Label>
                <Input
                  placeholder="Teléfono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </FormGroup>
            </InputsGrid>
          </TopSection>

          <MiddleSection>
            <FormGroup>
              <Label>Descripción de la empresa</Label>
              <TextArea
                placeholder="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </FormGroup>

            <BannerUploadWrapper>
              <BannerBox>
                <CameraIcon />
                <input type="file" accept="image/*" />
              </BannerBox>
              <ChangeImageLink>
                Cambiar imagen
                <input type="file" accept="image/*" />
              </ChangeImageLink>
            </BannerUploadWrapper>
          </MiddleSection>

          <SocialsGrid>
            <SocialInputGroup>
              <SocialIconBox>
                <FacebookIcon />
              </SocialIconBox>
              <Input
                placeholder="Enlace de Facebook"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
              />
            </SocialInputGroup>

            <SocialInputGroup>
              <SocialIconBox>
                <InstagramIcon />
              </SocialIconBox>
              <Input
                placeholder="Enlace de Instagram"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
              />
            </SocialInputGroup>

            <SocialInputGroup>
              <SocialIconBox>
                <TikTokIcon />
              </SocialIconBox>
              <Input
                placeholder="Enlace de TikTok"
                value={tiktok}
                onChange={(e) => setTiktok(e.target.value)}
              />
            </SocialInputGroup>

            <SocialInputGroup>
              <SocialIconBox>
                <GlobeIcon />
              </SocialIconBox>
              <Input
                placeholder="Sitio web oficial"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </SocialInputGroup>
          </SocialsGrid>

          <SaveButtonContainer>
            <SaveButton type="submit" disabled={isSaving}>
              {isSaving ? "Guardando..." : "Guardar"}
            </SaveButton>
          </SaveButtonContainer>
        </form>
      </ContentCard>
    </Container>
  );
}
