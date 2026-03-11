import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { FetchHttpClient } from "../../api/http/FetchHttpClient";
import { EmpresasApiClient } from "../../api/clients/EmpresasApiClient";
import type {
  CreateEmpresaRequest,
  Empresa,
  UpdateEmpresaRequest,
} from "../../core/domain/empresa/EmpresaTypes";

const httpClient = new FetchHttpClient();
const empresasApiClient = new EmpresasApiClient(httpClient);

const Container = styled.section`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

const PrimaryButton = styled.button`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  background-color: #f5f6fa;
  color: ${({ theme }) => theme.text};
  font-weight: bold;
  font-size: 0.9rem;
`;

const Tr = styled.tr`
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
`;

const Td = styled.td`
  padding: 1rem;
  color: ${({ theme }) => theme.textLight};
  font-size: 0.9rem;
  vertical-align: middle;
`;

const Logo = styled.img`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid #e5e7eb;
  background: white;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SmallButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.85rem;
  &:hover {
    background: #2563eb;
  }
`;

const FormGrid = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 96px;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const ButtonRow = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.75rem;
`;

const SecondaryButton = styled.button`
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: #f9fafb;
  }
`;

type EmpresaFormState = {
  nombre: string;
  telefono: string;
  email: string;
  nit: string;
  descripcion: string;
  descripcionLarga: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  webUrl: string;
  logoFile: File | null;
};

const emptyForm: EmpresaFormState = {
  nombre: "",
  telefono: "",
  email: "",
  nit: "",
  descripcion: "",
  descripcionLarga: "",
  facebookUrl: "",
  instagramUrl: "",
  tiktokUrl: "",
  webUrl: "",
  logoFile: null,
};

export function EmpresasModule() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [editingEmpresaId, setEditingEmpresaId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState<EmpresaFormState>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const uploadsBaseUrl = useMemo(() => {
    const uploadsEnv = (import.meta.env as { VITE_API_BASE_URL_IMG?: string })
      .VITE_API_BASE_URL_IMG;
    if (uploadsEnv) return uploadsEnv.replace(/\/$/, "");

    const apiBase: string | undefined = import.meta.env.VITE_API_BASE_URL;
    const apiHost = apiBase ? apiBase.replace(/\/api$/, "") : "";
    if (apiHost.includes("localhost")) return apiHost;

    return "https://bookmy.es";
  }, []);

  const loadEmpresas = async () => {
    try {
      setIsLoading(true);
      const response = await empresasApiClient.getEmpresas();
      setEmpresas(response.data ?? []);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEmpresas();
  }, []);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.nombre.trim()) nextErrors.nombre = "El nombre es requerido";
    if (!form.telefono.trim()) nextErrors.telefono = "El teléfono es requerido";
    if (!form.email.trim()) nextErrors.email = "El correo es requerido";
    else if (!emailRegex.test(form.email)) nextErrors.email = "Correo inválido";
    if (!form.nit.trim()) nextErrors.nit = "El NIT es requerido";
    if (!form.descripcion.trim())
      nextErrors.descripcion = "La descripción es requerida";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const openCreate = () => {
    setEditingEmpresaId(null);
    setForm(emptyForm);
    setErrors({});
    setIsFormOpen(true);
  };

  const openEdit = (empresa: Empresa) => {
    setEditingEmpresaId(empresa.id);
    setForm({
      nombre: empresa.nombre ?? "",
      telefono: empresa.telefono ?? "",
      email: empresa.email ?? "",
      nit: empresa.nit ?? "",
      descripcion: empresa.descripcion ?? "",
      descripcionLarga: empresa.descripcionLarga ?? "",
      facebookUrl: empresa.facebookUrl ?? "",
      instagramUrl: empresa.instagramUrl ?? "",
      tiktokUrl: empresa.tiktokUrl ?? "",
      webUrl: empresa.webUrl ?? "",
      logoFile: null,
    });
    setErrors({});
    setIsFormOpen(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, logoFile: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSaving(true);

      if (editingEmpresaId) {
        const payload: UpdateEmpresaRequest = {
          nombre: form.nombre,
          telefono: form.telefono,
          email: form.email,
          nit: form.nit,
          descripcion: form.descripcion,
          descripcionLarga: form.descripcionLarga,
          facebookUrl: form.facebookUrl,
          instagramUrl: form.instagramUrl,
          tiktokUrl: form.tiktokUrl,
          webUrl: form.webUrl,
          logo: form.logoFile,
        };
        await empresasApiClient.updateEmpresa(editingEmpresaId, payload);
      } else {
        const payload: CreateEmpresaRequest = {
          nombre: form.nombre,
          telefono: form.telefono,
          email: form.email,
          nit: form.nit,
          descripcion: form.descripcion,
          descripcionLarga: form.descripcionLarga,
          facebookUrl: form.facebookUrl,
          instagramUrl: form.instagramUrl,
          tiktokUrl: form.tiktokUrl,
          webUrl: form.webUrl,
          logo: form.logoFile,
        };
        await empresasApiClient.createEmpresa(payload);
      }

      setIsFormOpen(false);
      setEditingEmpresaId(null);
      setForm(emptyForm);
      await loadEmpresas();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Empresas</Title>
        <PrimaryButton onClick={openCreate}>+ Crear empresa</PrimaryButton>
      </Header>

      {isFormOpen && (
        <FormGrid onSubmit={handleSubmit}>
          <Field>
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
            />
            {errors.nombre && <ErrorMessage>{errors.nombre}</ErrorMessage>}
          </Field>

          <Field>
            <Label htmlFor="telefono">Teléfono *</Label>
            <Input
              id="telefono"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
            />
            {errors.telefono && <ErrorMessage>{errors.telefono}</ErrorMessage>}
          </Field>

          <Field>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </Field>

          <Field>
            <Label htmlFor="nit">NIT *</Label>
            <Input
              id="nit"
              name="nit"
              value={form.nit}
              onChange={handleChange}
            />
            {errors.nit && <ErrorMessage>{errors.nit}</ErrorMessage>}
          </Field>

          <Field style={{ gridColumn: "1 / -1" }}>
            <Label htmlFor="descripcion">Descripción *</Label>
            <TextArea
              id="descripcion"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
            />
            {errors.descripcion && (
              <ErrorMessage>{errors.descripcion}</ErrorMessage>
            )}
          </Field>

          <Field style={{ gridColumn: "1 / -1" }}>
            <Label htmlFor="descripcionLarga">Descripción larga</Label>
            <TextArea
              id="descripcionLarga"
              name="descripcionLarga"
              value={form.descripcionLarga}
              onChange={handleChange}
            />
          </Field>

          <Field>
            <Label htmlFor="facebookUrl">Facebook</Label>
            <Input
              id="facebookUrl"
              name="facebookUrl"
              value={form.facebookUrl}
              onChange={handleChange}
            />
          </Field>

          <Field>
            <Label htmlFor="instagramUrl">Instagram</Label>
            <Input
              id="instagramUrl"
              name="instagramUrl"
              value={form.instagramUrl}
              onChange={handleChange}
            />
          </Field>

          <Field>
            <Label htmlFor="tiktokUrl">TikTok</Label>
            <Input
              id="tiktokUrl"
              name="tiktokUrl"
              value={form.tiktokUrl}
              onChange={handleChange}
            />
          </Field>

          <Field>
            <Label htmlFor="webUrl">Web</Label>
            <Input
              id="webUrl"
              name="webUrl"
              value={form.webUrl}
              onChange={handleChange}
            />
          </Field>

          <Field style={{ gridColumn: "1 / -1" }}>
            <Label htmlFor="logo">Logo</Label>
            <Input
              id="logo"
              name="logo"
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
            />
          </Field>

          <ButtonRow>
            <SecondaryButton
              type="button"
              onClick={() => {
                setIsFormOpen(false);
                setEditingEmpresaId(null);
                setForm(emptyForm);
                setErrors({});
              }}
            >
              Cancelar
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={isSaving}>
              {isSaving
                ? "Guardando..."
                : editingEmpresaId
                  ? "Actualizar empresa"
                  : "Crear empresa"}
            </PrimaryButton>
          </ButtonRow>
        </FormGrid>
      )}

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Logo</Th>
              <Th>Nombre</Th>
              <Th>Email</Th>
              <Th>Teléfono</Th>
              <Th>NIT</Th>
              <Th>Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <Tr>
                <Td colSpan={7} style={{ textAlign: "center" }}>
                  Cargando...
                </Td>
              </Tr>
            ) : empresas.length > 0 ? (
              empresas.map((e) => (
                <Tr key={e.id}>
                  <Td>{e.id}</Td>
                  <Td>
                    <Logo
                      src={(() => {
                        if (!e.logo) return "/logo.png";
                        if (e.logo.startsWith("http")) return e.logo;
                        const cleanPath = e.logo.startsWith("/")
                          ? e.logo.slice(1)
                          : e.logo;
                        return `${uploadsBaseUrl}/${cleanPath}`;
                      })()}
                      alt={e.nombre}
                    />
                  </Td>
                  <Td>{e.nombre}</Td>
                  <Td>{e.email}</Td>
                  <Td>{e.telefono}</Td>
                  <Td>{e.nit}</Td>
                  <Td>
                    <Actions>
                      <SmallButton type="button" onClick={() => openEdit(e)}>
                        Editar
                      </SmallButton>
                    </Actions>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={7} style={{ textAlign: "center" }}>
                  No hay empresas registradas aún
                </Td>
              </Tr>
            )}
          </tbody>
        </Table>
      </TableWrapper>
    </Container>
  );
}
