import { useState, useEffect, useCallback, useMemo } from "react";
import styled from "styled-components";
import { FetchHttpClient } from "../../api/http/FetchHttpClient";
import {
  ProfesionalesApiClient,
  type Profesional,
} from "../../api/clients/ProfesionalesApiClient";
import {
  ServiceSedeProfesionalApiClient,
  type ServiceSedeProfesionalItem,
} from "../../api/clients/ServiceSedeProfesionalApiClient";
import { ReviewsModule } from "../reviews/ReviewsModule";
import { TableSearchFilter } from "../common/TableSearchFilter";

const httpClient = new FetchHttpClient();
const profesionalesApiClient = new ProfesionalesApiClient(httpClient);
const serviceSedeProfesionalApiClient = new ServiceSedeProfesionalApiClient(
  httpClient,
);

const uploadsBaseUrl = (() => {
  const env = (import.meta.env as { VITE_API_BASE_URL_IMG?: string })
    .VITE_API_BASE_URL_IMG;
  if (env) return env.replace(/\/$/, "");
  const apiBase = import.meta.env.VITE_API_BASE_URL;
  const host = apiBase ? apiBase.replace(/\/api$/, "") : "";
  if (host.includes("localhost")) return host;
  return "https://bookmy.es";
})();

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
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.textLight};
  font-size: 0.9rem;
`;

const BackButton = styled.button`
  background: white;
  color: ${({ theme }) => theme.text};
  border: 1px solid #e5e7eb;
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

const CreateButton = styled.button`
  background: #16a34a;
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #15803d;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(22, 163, 74, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  width: min(500px, 95vw);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 700;
  color: #374151;
`;

const Input = styled.input`
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-size: 0.95rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const CancelButton = styled.button`
  background: white;
  color: #374151;
  border: 1px solid #e5e7eb;
  padding: 0.65rem 1.25rem;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #f9fafb;
  }
`;

const SubmitButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.65rem 1.25rem;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SwitchLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
`;

const SwitchInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const SwitchTrack = styled.span<{ $checked: boolean }>`
  width: 40px;
  height: 22px;
  border-radius: 999px;
  background: ${({ $checked }) => ($checked ? "#16a34a" : "#e5e7eb")};
  position: relative;
  transition: background 0.15s ease;

  &::after {
    content: "";
    position: absolute;
    top: 3px;
    left: ${({ $checked }) => ($checked ? "20px" : "3px")};
    width: 16px;
    height: 16px;
    border-radius: 999px;
    background: white;
    transition: left 0.15s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.85rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 0.85rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`;

const CardTop = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Avatar = styled.div<{ $imageUrl: string | null }>`
  width: 64px;
  height: 64px;
  border-radius: 999px;
  flex: 0 0 64px;
  background-image: url(${({ $imageUrl }) => $imageUrl || "none"});
  background-size: cover;
  background-position: center;
  background-color: #e5e7eb;
  border: 2px solid #f3f4f6;

  ${({ $imageUrl }) =>
    !$imageUrl &&
    `
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%239ca3af' viewBox='0 0 24 24'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
  `}
`;

const CardBody = styled.div`
  flex: 1;
  min-width: 0;
`;

const CardTitle = styled.h4`
  margin: 0 0 0.5rem;
  font-size: 0.98rem;
  font-weight: 800;
  color: #111827;
`;

const Meta = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 0.55rem;

  div {
    margin-bottom: 0.25rem;
  }
`;

const ServiciosCount = styled.span`
  background: #dbeafe;
  color: #1d4ed8;
  padding: 0.35rem 0.65rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
`;

const TableWrapper = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
`;

const TableToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 0.85rem;
  border-bottom: 1px solid #f3f4f6;
  background: #ffffff;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  width: min(420px, 100%);
  padding: 0.55rem 0.75rem;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  outline: none;
  font-weight: 700;
  color: #111827;

  &:focus {
    border-color: #93c5fd;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background: #f9fafb;
`;

const Th = styled.th`
  text-align: left;
  font-size: 0.75rem;
  font-weight: 800;
  color: #374151;
  padding: 0.75rem 0.85rem;
  border-bottom: 1px solid #e5e7eb;
`;

const Tr = styled.tr`
  &:hover td {
    background: #f9fafb;
  }
`;

const Td = styled.td`
  padding: 0.75rem 0.85rem;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: top;
  font-size: 0.85rem;
  color: #111827;
`;

const ServiceName = styled.div`
  font-weight: 800;
  font-size: 0.9rem;
`;

const ServiceDesc = styled.div`
  margin-top: 0.25rem;
  font-size: 0.78rem;
  color: #6b7280;
`;

const PaginationRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.85rem;
  background: #ffffff;
`;

const PageInfo = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 700;
`;

const PageActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const PageButton = styled.button`
  background: white;
  color: #111827;
  border: 1px solid #e5e7eb;
  padding: 0.35rem 0.6rem;
  border-radius: 8px;
  font-weight: 800;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StatusBadge = styled.span<{ $active: boolean }>`
  background: ${({ $active }) => ($active ? "#dcfce7" : "#f3f4f6")};
  color: ${({ $active }) => ($active ? "#166534" : "#374151")};
  border: 1px solid ${({ $active }) => ($active ? "#86efac" : "#e5e7eb")};
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 800;
`;

const PriceText = styled.div`
  font-size: 0.78rem;
  color: #6b7280;
  font-weight: 700;
`;

const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  color: ${({ theme }) => theme.textLight};
  font-size: 1rem;
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
`;

interface Props {
  sedeId: number;
  sedeNombre: string;
  onBack: () => void;
}

export function SedeProfesionalesModule({ sedeId, sedeNombre, onBack }: Props) {
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProfesional, setSelectedProfesional] =
    useState<Profesional | null>(null);
  const [servicios, setServicios] = useState<ServiceSedeProfesionalItem[]>([]);
  const [isLoadingServicios, setIsLoadingServicios] = useState(false);
  const [servicesPage, setServicesPage] = useState(1);
  const pageSize = 10;
  const [servicesSearch, setServicesSearch] = useState("");
  const [updatingServiceIds, setUpdatingServiceIds] = useState<
    Record<number, boolean>
  >({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showReviews, setShowReviews] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    biografia: "",
    phone: "",
  });

  const filteredProfesionales = useMemo(() => {
    if (!searchTerm) return profesionales;
    const lower = searchTerm.toLowerCase();
    return profesionales.filter(
      (p) =>
        p.nombre?.toLowerCase().includes(lower) ||
        p.especialidad?.toLowerCase().includes(lower),
    );
  }, [profesionales, searchTerm]);

  const fetchProfesionales = useCallback(async () => {
    setIsLoading(true);
    try {
      const response =
        await profesionalesApiClient.getProfesionalesBySede(sedeId);
      // Ensure we always have an array even on 404 or empty response
      const data = Array.isArray(response.data) ? response.data : [];
      setProfesionales(data);
    } catch (error) {
      console.error("Error fetching profesionales:", error);
      setProfesionales([]);
    } finally {
      setIsLoading(false);
    }
  }, [sedeId]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.phone) return;

    setIsCreating(true);
    try {
      const data = new FormData();
      data.append("nombre", formData.nombre);
      data.append("biografia", formData.biografia);
      data.append("phone", formData.phone);
      data.append("sedeId", String(sedeId));
      if (selectedFile) {
        data.append("imagen", selectedFile);
      }

      await profesionalesApiClient.createProfesional(data);
      setIsModalOpen(false);
      setFormData({ nombre: "", biografia: "", phone: "" });
      setSelectedFile(null);
      await fetchProfesionales();
    } catch (error) {
      console.error("Error creating profesional:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const coerceNumber = useCallback((value: unknown): number | undefined => {
    if (typeof value === "number") return value;
    if (typeof value === "string" && value.trim() !== "") {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : undefined;
    }
    return undefined;
  }, []);

  const normalizeServicioRelationId = useCallback(
    (item: ServiceSedeProfesionalItem): ServiceSedeProfesionalItem => {
      if (item.serviceSedeProfesionalId) return item;

      const anyItem = item as unknown as Record<string, unknown>;

      const nestedRelation = anyItem.serviceSedeProfesional;
      const nestedRelationRecord =
        nestedRelation && typeof nestedRelation === "object"
          ? (nestedRelation as Record<string, unknown>)
          : null;

      const nestedService = anyItem.service;
      const nestedServiceRecord =
        nestedService && typeof nestedService === "object"
          ? (nestedService as Record<string, unknown>)
          : null;

      const serviceIdFromApi = coerceNumber(
        anyItem.serviceId ??
          anyItem.service_id ??
          anyItem.servicioId ??
          anyItem.servicio_id ??
          nestedServiceRecord?.id ??
          nestedServiceRecord?.Id,
      );

      if (item.asignado && typeof item.id === "number" && serviceIdFromApi) {
        return {
          ...item,
          id: serviceIdFromApi,
          serviceSedeProfesionalId: item.id,
        };
      }

      const relationId: unknown =
        anyItem.serviceSedeProfesionalId ??
        anyItem.serviceSedeProfesionalID ??
        anyItem.service_sede_profesional_id ??
        anyItem.serviceSedeProfesional_id ??
        anyItem.relationId ??
        anyItem.idRelacion ??
        nestedRelationRecord?.id ??
        nestedRelationRecord?.Id;

      const coercedRelationId = coerceNumber(relationId);
      return coercedRelationId
        ? { ...item, serviceSedeProfesionalId: coercedRelationId }
        : item;
    },
    [coerceNumber],
  );

  const toggleServicioAsignado = async (serviceId: number) => {
    if (!selectedProfesional) return;

    const current = servicios.find((s) => s.id === serviceId);
    if (!current) return;

    const prevAsignado = current.asignado;
    const prevRelationId = current.serviceSedeProfesionalId;

    setUpdatingServiceIds((prev) => ({ ...prev, [serviceId]: true }));
    setServicios((prev) =>
      prev.map((s) =>
        s.id === serviceId ? { ...s, asignado: !prevAsignado } : s,
      ),
    );

    try {
      if (!prevAsignado) {
        const response =
          await serviceSedeProfesionalApiClient.assignServicioToProfesional({
            serviceId,
            sedeId,
            profesionalId: selectedProfesional.id,
          });

        const relationId = response.data?.id;
        setServicios((prev) =>
          prev.map((s) =>
            s.id === serviceId
              ? {
                  ...s,
                  asignado: true,
                  serviceSedeProfesionalId:
                    relationId ?? s.serviceSedeProfesionalId,
                }
              : s,
          ),
        );
      } else {
        const normalizedCurrent = prevRelationId
          ? current
          : normalizeServicioRelationId(current);
        let relationIdToDelete =
          prevRelationId ?? normalizedCurrent.serviceSedeProfesionalId;

        if (!relationIdToDelete) {
          /*console.error(
            "Falta serviceSedeProfesionalId para DELETE. Item recibido del GET:",
            current,
          );*/

          const relationsResponse =
            await serviceSedeProfesionalApiClient.getAllRelations();

          const sedeIdNum = coerceNumber(sedeId) ?? sedeId;
          const profesionalIdNum =
            coerceNumber(selectedProfesional.id) ?? selectedProfesional.id;
          const serviceIdNum = coerceNumber(serviceId) ?? serviceId;

          const match = relationsResponse.data?.find((r) => {
            const rSedeId = coerceNumber(r.sedeId) ?? r.sedeId;
            const rProfesionalId =
              coerceNumber(r.profesionalId) ?? r.profesionalId;
            const rServiceId = coerceNumber(r.serviceId) ?? r.serviceId;

            return (
              rSedeId === sedeIdNum &&
              rProfesionalId === profesionalIdNum &&
              rServiceId === serviceIdNum
            );
          });

          relationIdToDelete = match?.id;

          if (!relationIdToDelete) {
            console.error(
              "No se encontró relación en GET /service-sede-profesional para borrar.",
              {
                sedeId: sedeIdNum,
                profesionalId: profesionalIdNum,
                serviceId: serviceIdNum,
                relationsCount: relationsResponse.data?.length ?? 0,
              },
            );
          }

          if (relationIdToDelete) {
            setServicios((prev) =>
              prev.map((s) =>
                s.id === serviceId
                  ? { ...s, serviceSedeProfesionalId: relationIdToDelete }
                  : s,
              ),
            );
          }
        }

        if (!relationIdToDelete) {
          throw new Error(
            "No se encontró serviceSedeProfesionalId para eliminar la asignación.",
          );
        }

        await serviceSedeProfesionalApiClient.unassignServicioFromProfesional(
          relationIdToDelete,
        );

        setServicios((prev) =>
          prev.map((s) =>
            s.id === serviceId
              ? { ...s, asignado: false, serviceSedeProfesionalId: undefined }
              : s,
          ),
        );
      }
    } catch (error) {
      console.error("Error actualizando asignación de servicio:", error);
      setServicios((prev) =>
        prev.map((s) =>
          s.id === serviceId
            ? {
                ...s,
                asignado: prevAsignado,
                serviceSedeProfesionalId: prevRelationId,
              }
            : s,
        ),
      );
    } finally {
      setUpdatingServiceIds((prev) => {
        const next = { ...prev };
        delete next[serviceId];
        return next;
      });
    }
  };

  useEffect(() => {
    fetchProfesionales();
  }, [fetchProfesionales]);

  useEffect(() => {
    const fetchServicios = async () => {
      if (!selectedProfesional) return;
      setIsLoadingServicios(true);
      try {
        const response =
          await serviceSedeProfesionalApiClient.getServiciosBySedeAndProfesional(
            sedeId,
            selectedProfesional.id,
          );
        const data = (response.data ?? []).map(normalizeServicioRelationId);
        setServicios(data);
      } catch (error) {
        console.error("Error fetching servicios por profesional:", error);
        setServicios([]);
      } finally {
        setIsLoadingServicios(false);
      }
    };

    fetchServicios();
  }, [sedeId, selectedProfesional, normalizeServicioRelationId]);

  useEffect(() => {
    setServicesPage(1);
  }, [selectedProfesional]);

  useEffect(() => {
    setServicesPage(1);
  }, [servicesSearch, servicios.length]);

  const normalizedSearch = servicesSearch.trim().toLowerCase();
  const serviciosFiltrados = normalizedSearch
    ? servicios.filter((s) => {
        const haystack =
          `${s.nombre} ${s.descripcion || ""} ${s.categoria || ""}`
            .toLowerCase()
            .trim();
        return haystack.includes(normalizedSearch);
      })
    : servicios;

  return (
    <Container>
      <Header>
        <TitleBlock>
          <Title>
            {selectedProfesional
              ? `Servicios - ${selectedProfesional.nombre}`
              : "Profesionales"}
          </Title>
          <Subtitle>{selectedProfesional ? sedeNombre : sedeNombre}</Subtitle>
        </TitleBlock>
        <HeaderActions>
          {!selectedProfesional && (
            <>
              <CreateButton type="button" onClick={() => setIsModalOpen(true)}>
                + Crear profesional
              </CreateButton>
              <CreateButton type="button" onClick={() => setShowReviews(true)}>
                Ver Reseñas
              </CreateButton>
            </>
          )}
          <BackButton
            type="button"
            onClick={() => {
              if (selectedProfesional) {
                setSelectedProfesional(null);
                setServicios([]);
                return;
              }
              onBack();
            }}
          />
        </HeaderActions>

        {!selectedProfesional && (
          <TableSearchFilter
            searchPlaceholder="Buscar profesionales..."
            onSearch={setSearchTerm}
          />
        )}
      </Header>

      {isModalOpen && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <Title style={{ marginBottom: "1.5rem" }}>Nuevo Profesional</Title>
            <Form onSubmit={handleCreateSubmit}>
              <FormGroup>
                <Label>Nombre*</Label>
                <Input
                  required
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, nombre: e.target.value }))
                  }
                  placeholder="Ej. Juan Pérez"
                />
              </FormGroup>
              <FormGroup>
                <Label>Teléfono*</Label>
                <Input
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="Ej. +34666555444"
                />
              </FormGroup>
              <FormGroup>
                <Label>Biografía</Label>
                <TextArea
                  value={formData.biografia}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      biografia: e.target.value,
                    }))
                  }
                  placeholder="Breve descripción..."
                />
              </FormGroup>
              <FormGroup>
                <Label>Imagen</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              </FormGroup>
              <ModalActions>
                <CancelButton
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </CancelButton>
                <SubmitButton type="submit" disabled={isCreating}>
                  {isCreating ? "Guardando..." : "Guardar Profesional"}
                </SubmitButton>
              </ModalActions>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}

      {selectedProfesional ? (
        isLoadingServicios ? (
          <LoadingText>Cargando servicios...</LoadingText>
        ) : servicios.length === 0 ? (
          <EmptyState>No hay servicios para este profesional</EmptyState>
        ) : (
          (() => {
            const totalPages = Math.max(
              1,
              Math.ceil(serviciosFiltrados.length / pageSize),
            );
            const page = Math.min(servicesPage, totalPages);
            const start = (page - 1) * pageSize;
            const end = start + pageSize;
            const pageItems = serviciosFiltrados.slice(start, end);
            const from = serviciosFiltrados.length === 0 ? 0 : start + 1;
            const to = Math.min(end, serviciosFiltrados.length);

            return (
              <TableWrapper>
                <TableToolbar>
                  <SearchInput
                    type="text"
                    value={servicesSearch}
                    placeholder="Buscar servicio..."
                    onChange={(e) => setServicesSearch(e.target.value)}
                  />
                  <PageInfo>{serviciosFiltrados.length} resultado(s)</PageInfo>
                </TableToolbar>
                <Table>
                  <Thead>
                    <tr>
                      <Th style={{ width: "52%" }}>Servicio</Th>
                      <Th style={{ width: "16%" }}>Categoría</Th>
                      <Th style={{ width: "18%" }}>Precio</Th>
                      <Th style={{ width: "14%" }}>Asignar</Th>
                      <Th style={{ width: "14%" }}>Estado</Th>
                    </tr>
                  </Thead>
                  <tbody>
                    {pageItems.length === 0 ? (
                      <Tr>
                        <Td colSpan={5}>
                          <div style={{ color: "#6b7280", fontWeight: 700 }}>
                            No se encontraron servicios
                          </div>
                        </Td>
                      </Tr>
                    ) : (
                      pageItems.map((s) => {
                        const firstPrice = s.precios?.[0];
                        const priceLabel = firstPrice
                          ? `${firstPrice.amount} ${firstPrice.currency} · ${firstPrice.duration} min`
                          : "";

                        return (
                          <Tr key={s.id}>
                            <Td>
                              <ServiceName>{s.nombre}</ServiceName>
                              {s.descripcion ? (
                                <ServiceDesc>{s.descripcion}</ServiceDesc>
                              ) : null}
                            </Td>
                            <Td>
                              <div
                                style={{ color: "#6b7280", fontWeight: 700 }}
                              >
                                {s.categoria || "-"}
                              </div>
                            </Td>
                            <Td>
                              <PriceText>{priceLabel || "-"}</PriceText>
                            </Td>
                            <Td>
                              <SwitchLabel
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <SwitchInput
                                  type="checkbox"
                                  checked={s.asignado}
                                  disabled={Boolean(updatingServiceIds[s.id])}
                                  onChange={() => toggleServicioAsignado(s.id)}
                                />
                                <SwitchTrack $checked={s.asignado} />
                              </SwitchLabel>
                            </Td>
                            <Td>
                              <StatusBadge $active={s.asignado}>
                                {s.asignado ? "Activo" : "Inactivo"}
                              </StatusBadge>
                            </Td>
                          </Tr>
                        );
                      })
                    )}
                  </tbody>
                </Table>

                <PaginationRow>
                  <PageInfo>
                    Mostrando {from}-{to} de {serviciosFiltrados.length}
                  </PageInfo>
                  <PageActions>
                    <PageButton
                      type="button"
                      onClick={() => setServicesPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                    >
                      Anterior
                    </PageButton>
                    <PageButton
                      type="button"
                      onClick={() =>
                        setServicesPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page >= totalPages}
                    >
                      Siguiente
                    </PageButton>
                  </PageActions>
                </PaginationRow>
              </TableWrapper>
            );
          })()
        )
      ) : isLoading ? (
        <LoadingText>Cargando profesionales...</LoadingText>
      ) : filteredProfesionales.length === 0 ? (
        <EmptyState>No hay profesionales en esta sede</EmptyState>
      ) : (
        <Grid>
          {filteredProfesionales.map((prof) => {
            const imageUrl = prof.imagen
              ? prof.imagen.startsWith("http")
                ? prof.imagen
                : `${uploadsBaseUrl}/${prof.imagen.replace(/^\//, "")}`
              : null;
            return (
              <Card key={prof.id} onClick={() => setSelectedProfesional(prof)}>
                <CardTop>
                  <Avatar $imageUrl={imageUrl} />
                  <CardBody>
                    <CardTitle>{prof.nombre}</CardTitle>
                    <Meta>
                      <div>{prof.telefono}</div>
                      {prof.biografia && <div>{prof.biografia}</div>}
                    </Meta>
                    <ServiciosCount>
                      {prof.servicios.length} servicio(s)
                    </ServiciosCount>
                  </CardBody>
                </CardTop>
              </Card>
            );
          })}
        </Grid>
      )}
      {showReviews && (
        <ModalOverlay onClick={() => setShowReviews(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h2>Reseñas de la Sede</h2>
              <BackButton type="button" onClick={() => setShowReviews(false)}>
                Cerrar
              </BackButton>
            </div>
            <ReviewsModule sedeId={sedeId} />
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}
