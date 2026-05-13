import { useEffect, useMemo, useState, type FormEvent } from "react";
import styled from "styled-components";
import { FetchHttpClient } from "../../api/http/FetchHttpClient";
import { SedesApiClient, type Sede } from "../../api/clients/SedesApiClient";
import { SedeProfesionalesModule } from "./SedeProfesionalesModule";
import { ReviewsModule } from "../reviews/ReviewsModule";

const httpClient = new FetchHttpClient();
const sedesApiClient = new SedesApiClient(httpClient);

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

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

const DayRow = styled.div`
  display: grid;
  grid-template-columns: 130px 1fr;
  gap: 0.75rem;
  align-items: center;
  padding: 0.65rem;
  border: 1px solid #eef2f7;
  border-radius: 12px;
  background: #fbfbfc;
`;

const SwitchLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  color: #111827;
  font-weight: 900;
  font-size: 0.85rem;
`;

const Switch = styled.input`
  width: 44px;
  height: 24px;
  appearance: none;
  background: #e5e7eb;
  border-radius: 999px;
  position: relative;
  cursor: pointer;
  outline: none;
  transition: background 0.2s ease;

  &::after {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    width: 18px;
    height: 18px;
    border-radius: 999px;
    background: white;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);
    transition: transform 0.2s ease;
  }

  &:checked {
    background: #10b981;
  }

  &:checked::after {
    transform: translateX(20px);
  }
`;

const HoursRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
`;

const CreatePanel = styled.div`
  background: white;
  border: 1px solid #eef2f7;
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  margin-bottom: 1rem;
`;

const CreateHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

const CreateTitle = styled.h4`
  margin: 0;
  color: #111827;
  font-size: 1rem;
  font-weight: 900;
`;

const ToggleButton = styled.button`
  background: #111827;
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 10px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.92;
    transform: translateY(-1px);
  }
`;

const FormGrid = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
  margin-top: 1rem;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const Label = styled.label`
  color: #374151;
  font-weight: 800;
  font-size: 0.85rem;
`;

const Input = styled.input`
  padding: 0.7rem 0.85rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  outline: none;
  font-size: 0.9rem;

  &:focus {
    border-color: #10b981;
    background: white;
  }
`;

const TimeInput = styled(Input)`
  width: 130px;
`;

const AddDateButton = styled.button`
  background: #111827;
  color: white;
  border: none;
  padding: 0.65rem 1rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background: #374151;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SelectedDates = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.75rem;
`;

const DateChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  border-radius: 999px;
  padding: 0.35rem 0.6rem;
  font-size: 0.8rem;
  font-weight: 700;
`;

const RemoveDate = styled.button`
  background: none;
  border: none;
  color: #dc2626;
  font-size: 1rem;
  font-weight: 900;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  margin-left: 0.15rem;

  &:hover {
    color: #b91c1c;
  }
`;

const Row = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  padding: 0.7rem 1rem;
  border-radius: 10px;
  font-weight: 900;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #059669;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SecondaryButton = styled.button`
  background: white;
  color: #111827;
  border: 1px solid #e5e7eb;
  padding: 0.7rem 1rem;
  border-radius: 10px;
  font-weight: 900;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.article`
  background: white;
  border: 1px solid #eef2f7;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 18px 35px rgba(0, 0, 0, 0.08);
  }
`;

const Cover = styled.div<{ $imageUrl: string | null }>`
  height: 150px;
  background: ${({ $imageUrl }) =>
    $imageUrl ? `url(${$imageUrl})` : "#f3f4f6"};
  background-size: cover;
  background-position: center;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.35));
  }
`;

const CardBody = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const CardTitle = styled.h4`
  margin: 0;
  color: #111827;
  font-size: 1.05rem;
  font-weight: 900;
  line-height: 1.2;
`;

const Meta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  color: #6b7280;
  font-size: 0.9rem;
`;

const BadgeRow = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 0.25rem 0.6rem;
  font-size: 0.78rem;
  font-weight: 700;
`;

const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.textLight};
`;

const ViewProfesionalesButton = styled.button`
  background: #111827;
  color: white;
  border: none;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #374151;
  }
`;

const ReviewsButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #2563eb;
  }
`;

const UpdateSedeButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #059669;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.75rem;
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  background: ${({ $active }) => ($active ? "#111827" : "transparent")};
  color: ${({ $active }) => ($active ? "white" : "#6b7280")};
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ $active }) => ($active ? "#111827" : "#f3f4f6")};
  }
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-top: 1rem;
`;

const ImageCard = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RemoveImageBtn = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;

  &:hover {
    background: #dc2626;
  }
`;

const NotificationBanner = styled.div<{ $type: "success" | "error" }>`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 8px;
  background: ${({ $type }) => ($type === "success" ? "#10b981" : "#ef4444")};
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 2000;
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  width: min(900px, 95vw);
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
`;

type Props = {
  empresaId: number;
  empresaNombre: string;
  uploadsBaseUrl: string;
  onBack: () => void;
};

export function EmpresaSedesModule({
  empresaId,
  empresaNombre,
  uploadsBaseUrl,
  onBack,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [selectedSede, setSelectedSede] = useState<Sede | null>(null);
  const [showReviews, setShowReviews] = useState(false);
  const [selectedSedeId, setSelectedSedeId] = useState<number | null>(null);
  const [isEditingSede, setIsEditingSede] = useState(false);
  const [editingSede, setEditingSede] = useState<Sede | null>(null);
  const [editForm, setEditForm] = useState({
    nombre: "",
    provincia: "",
    direccion: "",
    telefono: "",
    latitud: "",
    longitud: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingImage, setDeletingImage] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });
  const [editModalTab, setEditModalTab] = useState<"datos" | "imagenes">(
    "datos",
  );
  const [editImagenes, setEditImagenes] = useState<File[]>([]);
  const [editExistingImages, setEditExistingImages] = useState<string[]>([]);
  const [createForm, setCreateForm] = useState({
    nombre: "",
    provincia: "",
    direccion: "",
    telefono: "",
    latitud: "",
    longitud: "",
    diasCerrado: "",
  });

  const [editHorarioDays, setEditHorarioDays] = useState(() => ({
    lunes: { enabled: true, open: "10:00", close: "19:00" },
    martes: { enabled: true, open: "10:00", close: "19:00" },
    miércoles: { enabled: true, open: "10:00", close: "19:00" },
    jueves: { enabled: true, open: "10:00", close: "19:00" },
    viernes: { enabled: true, open: "10:00", close: "19:00" },
    sábado: { enabled: true, open: "10:00", close: "19:00" },
    domingo: { enabled: false, open: "10:00", close: "19:00" },
  }));

  const [editDiasCerrado, setEditDiasCerrado] = useState<string[]>([]);
  const [editNewDateToAdd, setEditNewDateToAdd] = useState("");

  const [diasCerrado, setDiasCerrado] = useState<string[]>([]);
  const [newDateToAdd, setNewDateToAdd] = useState("");

  const [horarioDays, setHorarioDays] = useState(() => ({
    lunes: { enabled: true, open: "10:00", close: "19:00" },
    martes: { enabled: true, open: "10:00", close: "19:00" },
    miércoles: { enabled: true, open: "10:00", close: "19:00" },
    jueves: { enabled: true, open: "10:00", close: "19:00" },
    viernes: { enabled: true, open: "10:00", close: "19:00" },
    sábado: { enabled: true, open: "10:00", close: "19:00" },
    domingo: { enabled: false, open: "10:00", close: "19:00" },
  }));

  const [imagenes, setImagenes] = useState<File[]>([]);

  const daysOrder = useMemo(
    () =>
      [
        "lunes",
        "martes",
        "miércoles",
        "jueves",
        "viernes",
        "sábado",
        "domingo",
      ] as const,
    [],
  );

  const loadSedes = async () => {
    try {
      setIsLoading(true);
      const response = await sedesApiClient.getSedesByEmpresaId(empresaId, {
        withServices: false,
      });
      setSedes(response.data ?? []);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSedes();
  }, [empresaId]);

  const refreshSedes = async () => {
    const response = await sedesApiClient.getSedesByEmpresaId(empresaId, {
      withServices: false,
    });
    setSedes(response.data ?? []);
  };

  const handleCreateSedeSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    try {
      setIsCreating(true);

      const horario = Object.fromEntries(
        daysOrder.map((day) => {
          const cfg = horarioDays[day];
          return [day, cfg.enabled ? `${cfg.open}-${cfg.close}` : "Cerrado"];
        }),
      );
      const formData = new FormData();

      imagenes.forEach((img) => formData.append("imagenes", img));
      formData.append("horario", JSON.stringify(horario));
      formData.append("empresaId", String(empresaId));
      formData.append("nombre", createForm.nombre);
      formData.append("provincia", createForm.provincia);
      formData.append("direccion", createForm.direccion);
      formData.append(
        "diasCerrado",
        diasCerrado.length > 0 ? JSON.stringify(diasCerrado) : "[]",
      );
      formData.append("telefono", createForm.telefono);
      formData.append("longitud", createForm.longitud);
      formData.append("latitud", createForm.latitud);

      const response = await sedesApiClient.createSede(formData);
      if (!response.ok) {
        setCreateError("No se pudo crear la sede");
        return;
      }

      setCreateForm((prev) => ({
        ...prev,
        nombre: "",
        provincia: "",
        direccion: "",
        telefono: "",
        latitud: "",
        longitud: "",
        googleMapsUrl: "",
        diasCerrado: "",
      }));
      setHorarioDays({
        lunes: { enabled: true, open: "10:00", close: "19:00" },
        martes: { enabled: true, open: "10:00", close: "19:00" },
        miércoles: { enabled: true, open: "10:00", close: "19:00" },
        jueves: { enabled: true, open: "10:00", close: "19:00" },
        viernes: { enabled: true, open: "10:00", close: "19:00" },
        sábado: { enabled: true, open: "10:00", close: "19:00" },
        domingo: { enabled: false, open: "10:00", close: "19:00" },
      });
      setImagenes([]);
      setIsCreateOpen(false);
      await refreshSedes();
    } catch {
      setCreateError("No se pudo crear la sede");
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateSedeSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingSede) return;

    try {
      setIsUpdating(true);

      const horario = Object.fromEntries(
        daysOrder.map((day) => {
          const cfg = editHorarioDays[day];
          return [day, cfg.enabled ? `${cfg.open}-${cfg.close}` : "Cerrado"];
        }),
      );

      const updateData = {
        nombre: editForm.nombre,
        direccion: editForm.direccion,
        telefono: editForm.telefono,
        latitud: parseFloat(editForm.latitud) || 0,
        longitud: parseFloat(editForm.longitud) || 0,
        provincia: editForm.provincia,
        horario,
        diasCerrado: editDiasCerrado,
        empresaId: editingSede.empresaId,
      };

      const response = await sedesApiClient.updateSede(
        editingSede.id,
        updateData,
      );

      if (!response.ok) {
        setNotification({
          show: true,
          message: response.data?.message || "Error al actualizar la sede",
          type: "error",
        });
        setTimeout(
          () => setNotification((p) => ({ ...p, show: false })),
          3000,
        );
        return;
      }

      setNotification({
        show: true,
        message: "Sede actualizada exitosamente",
        type: "success",
      });
      setTimeout(() => {
        setNotification((p) => ({ ...p, show: false }));
        setIsEditingSede(false);
        setEditingSede(null);
      }, 1500);

      await refreshSedes();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "No se pudo actualizar la sede";
      setNotification({
        show: true,
        message: errorMessage,
        type: "error",
      });
      setTimeout(
        () => setNotification((p) => ({ ...p, show: false })),
        3000,
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // Initialize edit form when clicking update button
  useEffect(() => {
    if (editingSede) {
      setEditForm({
        nombre: editingSede.nombre || "",
        provincia: editingSede.provincia || "",
        direccion: editingSede.direccion || "",
        telefono: editingSede.telefono || "",
        latitud: editingSede.latitud?.toString() || "",
        longitud: editingSede.longitud?.toString() || "",
      });
      setEditImagenes([]);
      setEditExistingImages(editingSede.imagenes || []);

      // Initialize schedule
      if (editingSede.horario) {
        const horarioConfig = Object.fromEntries(
          daysOrder.map((day) => {
            const horarioStr = editingSede.horario[day];
            if (horarioStr === "Cerrado" || !horarioStr) {
              return [day, { enabled: false, open: "10:00", close: "19:00" }];
            }
            const [open, close] = horarioStr.split("-");
            return [day, { enabled: true, open: open || "10:00", close: close || "19:00" }];
          }),
        );
        setEditHorarioDays(horarioConfig as any);
      }

      // Initialize closed days
      if (editingSede.diasCerrado) {
        const dias =
          typeof editingSede.diasCerrado === "string"
            ? JSON.parse(editingSede.diasCerrado)
            : editingSede.diasCerrado;
        setEditDiasCerrado(Array.isArray(dias) ? dias : []);
      } else {
        setEditDiasCerrado([]);
      }

      setEditNewDateToAdd("");
    }
  }, [editingSede, daysOrder]);

  const cards = useMemo(() => {
    return sedes.map((s) => {
      const coverPath = s.imagenes?.[0] ?? null;
      const cleanPath = coverPath
        ? coverPath.startsWith("/")
          ? coverPath.slice(1)
          : coverPath
        : null;
      const coverUrl = cleanPath ? `${uploadsBaseUrl}/${cleanPath}` : null;

      return {
        sede: s,
        coverUrl,
      };
    });
  }, [sedes, uploadsBaseUrl]);

  if (selectedSede) {
    return (
      <SedeProfesionalesModule
        sedeId={selectedSede.id}
        sedeNombre={selectedSede.nombre}
        onBack={() => setSelectedSede(null)}
      />
    );
  }

  return (
    <Container>
      <Header>
        <TitleBlock>
          <Title>Sedes</Title>
          <Subtitle>{empresaNombre}</Subtitle>
        </TitleBlock>
        <BackButton type="button" onClick={onBack}>
          Volver
        </BackButton>
      </Header>

      <CreatePanel>
        <CreateHeaderRow>
          <CreateTitle>Crear sede</CreateTitle>
          <ToggleButton
            type="button"
            onClick={() => setIsCreateOpen((prev) => !prev)}
          >
            {isCreateOpen ? "Ocultar" : "Nueva sede"}
          </ToggleButton>
        </CreateHeaderRow>

        {isCreateOpen && (
          <FormGrid onSubmit={handleCreateSedeSubmit}>
            <Field>
              <Label>Nombre *</Label>
              <Input
                value={createForm.nombre}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, nombre: e.target.value }))
                }
                required
              />
            </Field>

            <Field>
              <Label>Provincia *</Label>
              <Input
                value={createForm.provincia}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    provincia: e.target.value,
                  }))
                }
                required
              />
            </Field>

            <Field style={{ gridColumn: "1 / -1" }}>
              <Label>Dirección *</Label>
              <Input
                value={createForm.direccion}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    direccion: e.target.value,
                  }))
                }
                required
              />
            </Field>

            <Field>
              <Label>Teléfono *</Label>
              <Input
                value={createForm.telefono}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    telefono: e.target.value,
                  }))
                }
                required
              />
            </Field>

            <Field>
              <Label>Latitud *</Label>
              <Input
                value={createForm.latitud}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    latitud: e.target.value,
                  }))
                }
                required
              />
            </Field>

            <Field>
              <Label>Longitud *</Label>
              <Input
                value={createForm.longitud}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    longitud: e.target.value,
                  }))
                }
                required
              />
            </Field>

            <Field style={{ gridColumn: "1 / -1" }}>
              <Label>Horario *</Label>
              <DaysGrid>
                {daysOrder.map((day) => (
                  <DayRow key={day}>
                    <SwitchLabel>
                      <span style={{ textTransform: "capitalize" }}>{day}</span>
                      <Switch
                        type="checkbox"
                        checked={horarioDays[day].enabled}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setHorarioDays((prev) => ({
                            ...prev,
                            [day]: { ...prev[day], enabled: checked },
                          }));
                        }}
                      />
                    </SwitchLabel>
                    <HoursRow>
                      <TimeInput
                        type="time"
                        value={horarioDays[day].open}
                        disabled={!horarioDays[day].enabled}
                        onChange={(e) => {
                          const val = e.target.value;
                          setHorarioDays((prev) => ({
                            ...prev,
                            [day]: { ...prev[day], open: val },
                          }));
                        }}
                      />
                      <span style={{ color: "#6b7280", fontWeight: 800 }}>
                        -
                      </span>
                      <TimeInput
                        type="time"
                        value={horarioDays[day].close}
                        disabled={!horarioDays[day].enabled}
                        onChange={(e) => {
                          const val = e.target.value;
                          setHorarioDays((prev) => ({
                            ...prev,
                            [day]: { ...prev[day], close: val },
                          }));
                        }}
                      />
                    </HoursRow>
                  </DayRow>
                ))}
              </DaysGrid>
            </Field>

            <Field style={{ gridColumn: "1 / -1" }}>
              <Label>Días cerrado (opcional)</Label>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Input
                  type="date"
                  value={newDateToAdd}
                  onChange={(e) => setNewDateToAdd(e.target.value)}
                  style={{ width: "180px" }}
                />
                <AddDateButton
                  type="button"
                  onClick={() => {
                    if (newDateToAdd && !diasCerrado.includes(newDateToAdd)) {
                      setDiasCerrado((prev) => [...prev, newDateToAdd].sort());
                      setNewDateToAdd("");
                    }
                  }}
                  disabled={!newDateToAdd}
                >
                  + Agregar
                </AddDateButton>
              </div>
              {diasCerrado.length > 0 && (
                <SelectedDates>
                  {diasCerrado.map((date) => (
                    <DateChip key={date}>
                      {new Date(date).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                      <RemoveDate
                        type="button"
                        onClick={() =>
                          setDiasCerrado((prev) =>
                            prev.filter((d) => d !== date),
                          )
                        }
                      >
                        ×
                      </RemoveDate>
                    </DateChip>
                  ))}
                </SelectedDates>
              )}
            </Field>

            <Field style={{ gridColumn: "1 / -1" }}>
              <Label>Imágenes</Label>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = e.target.files
                    ? Array.from(e.target.files)
                    : [];
                  setImagenes(files);
                }}
              />
            </Field>

            {createError && (
              <Field style={{ gridColumn: "1 / -1" }}>
                <div style={{ color: "#ef4444", fontWeight: 700 }}>
                  {createError}
                </div>
              </Field>
            )}

            <Field style={{ gridColumn: "1 / -1" }}>
              <Row>
                <SecondaryButton
                  type="button"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setCreateError(null);
                  }}
                >
                  Cancelar
                </SecondaryButton>
                <PrimaryButton type="submit" disabled={isCreating}>
                  {isCreating ? "Creando..." : "Crear sede"}
                </PrimaryButton>
              </Row>
            </Field>
          </FormGrid>
        )}
      </CreatePanel>

      {isLoading ? (
        <EmptyState>Cargando sedes...</EmptyState>
      ) : cards.length === 0 ? (
        <EmptyState>No hay sedes registradas para esta empresa</EmptyState>
      ) : (
        <Grid>
          {cards.map(({ sede, coverUrl }) => (
            <Card key={sede.id}>
              <Cover $imageUrl={coverUrl} />
              <CardBody>
                <CardTitle>{sede.nombre}</CardTitle>
                <Meta>
                  <div>{sede.direccion}</div>
                  <div>{sede.telefono}</div>
                </Meta>
                <BadgeRow>
                  <Badge>{sede.provincia}</Badge>
                  <ViewProfesionalesButton
                    type="button"
                    onClick={() => setSelectedSede(sede)}
                  >
                    Ver profesionales
                  </ViewProfesionalesButton>
                  <ReviewsButton
                    type="button"
                    onClick={() => {
                      setSelectedSedeId(sede.id);
                      setShowReviews(true);
                    }}
                  >
                    Ver reseñas
                  </ReviewsButton>
                  <UpdateSedeButton
                    type="button"
                    onClick={() => {
                      setEditingSede(sede);
                      setIsEditingSede(true);
                    }}
                  >
                    Actualizar sede
                  </UpdateSedeButton>
                </BadgeRow>
              </CardBody>
            </Card>
          ))}
        </Grid>
      )}
      {showReviews && selectedSedeId && (
        <ModalOverlay onClick={() => setShowReviews(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Reseñas de la Sede</ModalTitle>
              <BackButton type="button" onClick={() => setShowReviews(false)}>
                Cerrar
              </BackButton>
            </ModalHeader>
            <ReviewsModule sedeId={selectedSedeId} />
          </ModalContent>
        </ModalOverlay>
      )}

      {isEditingSede && editingSede && (
        <ModalOverlay onClick={() => setIsEditingSede(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Actualizar Sede</ModalTitle>
              <BackButton type="button" onClick={() => setIsEditingSede(false)}>
                Cerrar
              </BackButton>
            </ModalHeader>

            <TabContainer>
              <TabButton
                $active={editModalTab === "datos"}
                onClick={() => setEditModalTab("datos")}
              >
                Datos
              </TabButton>
              <TabButton
                $active={editModalTab === "imagenes"}
                onClick={() => setEditModalTab("imagenes")}
              >
                Imágenes
              </TabButton>
            </TabContainer>

            {editModalTab === "datos" && (
              <FormGrid onSubmit={handleUpdateSedeSubmit}>
                <Field>
                  <Label>Nombre *</Label>
                  <Input
                    value={editForm.nombre}
                    onChange={(e) =>
                      setEditForm({ ...editForm, nombre: e.target.value })
                    }
                    required
                  />
                </Field>
                <Field>
                  <Label>Provincia *</Label>
                  <Input
                    value={editForm.provincia}
                    onChange={(e) =>
                      setEditForm({ ...editForm, provincia: e.target.value })
                    }
                    required
                  />
                </Field>
                <Field>
                  <Label>Dirección *</Label>
                  <Input
                    value={editForm.direccion}
                    onChange={(e) =>
                      setEditForm({ ...editForm, direccion: e.target.value })
                    }
                    required
                  />
                </Field>
                <Field>
                  <Label>Teléfono *</Label>
                  <Input
                    value={editForm.telefono}
                    onChange={(e) =>
                      setEditForm({ ...editForm, telefono: e.target.value })
                    }
                    required
                  />
                </Field>
                <Field>
                  <Label>Latitud</Label>
                  <Input
                    type="number"
                    step="any"
                    value={editForm.latitud}
                    onChange={(e) =>
                      setEditForm({ ...editForm, latitud: e.target.value })
                    }
                  />
                </Field>
                <Field>
                  <Label>Longitud</Label>
                  <Input
                    type="number"
                    step="any"
                    value={editForm.longitud}
                    onChange={(e) =>
                      setEditForm({ ...editForm, longitud: e.target.value })
                    }
                  />
                </Field>

                <Field style={{ gridColumn: "1 / -1" }}>
                  <Label>Horario *</Label>
                  <DaysGrid>
                    {daysOrder.map((day) => (
                      <DayRow key={day}>
                        <SwitchLabel>
                          <span style={{ textTransform: "capitalize" }}>
                            {day}
                          </span>
                          <Switch
                            type="checkbox"
                            checked={editHorarioDays[day].enabled}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setEditHorarioDays((prev) => ({
                                ...prev,
                                [day]: {
                                  ...prev[day],
                                  enabled: checked,
                                },
                              }));
                            }}
                          />
                        </SwitchLabel>
                        <HoursRow>
                          <TimeInput
                            type="time"
                            value={editHorarioDays[day].open}
                            disabled={!editHorarioDays[day].enabled}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEditHorarioDays((prev) => ({
                                ...prev,
                                [day]: { ...prev[day], open: val },
                              }));
                            }}
                          />
                          <span style={{ color: "#6b7280", fontWeight: 800 }}>
                            -
                          </span>
                          <TimeInput
                            type="time"
                            value={editHorarioDays[day].close}
                            disabled={!editHorarioDays[day].enabled}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEditHorarioDays((prev) => ({
                                ...prev,
                                [day]: { ...prev[day], close: val },
                              }));
                            }}
                          />
                        </HoursRow>
                      </DayRow>
                    ))}
                  </DaysGrid>
                </Field>

                <Field style={{ gridColumn: "1 / -1" }}>
                  <Label>Días cerrado (opcional)</Label>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <Input
                      type="date"
                      value={editNewDateToAdd}
                      onChange={(e) => setEditNewDateToAdd(e.target.value)}
                      style={{ width: "180px" }}
                    />
                    <AddDateButton
                      type="button"
                      onClick={() => {
                        if (
                          editNewDateToAdd &&
                          !editDiasCerrado.includes(editNewDateToAdd)
                        ) {
                          setEditDiasCerrado((prev) =>
                            [...prev, editNewDateToAdd].sort(),
                          );
                          setEditNewDateToAdd("");
                        }
                      }}
                      disabled={!editNewDateToAdd}
                    >
                      + Agregar
                    </AddDateButton>
                  </div>
                  {editDiasCerrado.length > 0 && (
                    <SelectedDates>
                      {editDiasCerrado.map((date) => (
                        <DateChip key={date}>
                          {new Date(date).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                          <RemoveDate
                            type="button"
                            onClick={() =>
                              setEditDiasCerrado((prev) =>
                                prev.filter((d) => d !== date),
                              )
                            }
                          >
                            ×
                          </RemoveDate>
                        </DateChip>
                      ))}
                    </SelectedDates>
                  )}
                </Field>

                <Field style={{ gridColumn: "1 / -1" }}>
                  <Row>
                    <SecondaryButton
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsEditingSede(false);
                      }}
                    >
                      Cancelar
                    </SecondaryButton>
                    <PrimaryButton type="submit" disabled={isUpdating}>
                      {isUpdating ? "Actualizando..." : "Actualizar datos"}
                    </PrimaryButton>
                  </Row>
                </Field>
              </FormGrid>
            )}

            {editModalTab === "imagenes" && (
              <FormGrid>
                <Field style={{ gridColumn: "1 / -1" }}>
                  <Label>Imágenes actuales</Label>
                  <ImageGrid>
                    {editExistingImages.map((img, idx) => (
                      <ImageCard key={idx}>
                        <img
                          src={`${uploadsBaseUrl}/${img.replace(/^\//, "")}`}
                          alt=""
                        />
                        <RemoveImageBtn
                          type="button"
                          disabled={deletingImage}
                          onClick={async (e) => {
                            e.preventDefault();
                            if (!editingSede) return;
                            const imageToDelete = editExistingImages[idx];
                            try {
                              setDeletingImage(true);
                              const response =
                                await sedesApiClient.deleteSedeImages(
                                  editingSede.id,
                                  [imageToDelete],
                                );
                              if (response.ok) {
                                const newImages = editExistingImages.filter(
                                  (_, i) => i !== idx,
                                );
                                setEditExistingImages(newImages);
                                setEditingSede((prev) =>
                                  prev
                                    ? { ...prev, imagenes: newImages }
                                    : null,
                                );
                                setNotification({
                                  show: true,
                                  message: "Imagen eliminada",
                                  type: "success",
                                });
                                setTimeout(
                                  () =>
                                    setNotification((p) => ({
                                      ...p,
                                      show: false,
                                    })),
                                  3000,
                                );
                              } else {
                                setNotification({
                                  show: true,
                                  message: "Error al eliminar imagen",
                                  type: "error",
                                });
                                setTimeout(
                                  () =>
                                    setNotification((p) => ({
                                      ...p,
                                      show: false,
                                    })),
                                  3000,
                                );
                              }
                            } catch (error) {
                              console.error("Error deleting image:", error);
                              setNotification({
                                show: true,
                                message: "Error al eliminar imagen",
                                type: "error",
                              });
                              setTimeout(
                                () =>
                                  setNotification((p) => ({
                                    ...p,
                                    show: false,
                                  })),
                                3000,
                              );
                            } finally {
                              setDeletingImage(false);
                            }
                          }}
                        >
                          ×
                        </RemoveImageBtn>
                      </ImageCard>
                    ))}
                  </ImageGrid>
                </Field>

                <Field style={{ gridColumn: "1 / -1" }}>
                  <Label>Agregar nuevas imágenes</Label>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      e.preventDefault();
                      const files = e.target.files
                        ? Array.from(e.target.files)
                        : [];
                      setEditImagenes(files);
                    }}
                  />
                  {editImagenes.length > 0 && (
                    <ImageGrid>
                      {editImagenes.map((file, idx) => (
                        <ImageCard key={`new-${idx}`}>
                          <img src={URL.createObjectURL(file)} alt="" />
                          <RemoveImageBtn
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setEditImagenes((prev) =>
                                prev.filter((_, i) => i !== idx),
                              );
                            }}
                          >
                            ×
                          </RemoveImageBtn>
                        </ImageCard>
                      ))}
                    </ImageGrid>
                  )}
                </Field>

                <Field style={{ gridColumn: "1 / -1" }}>
                  <Row>
                    <SecondaryButton
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsEditingSede(false);
                      }}
                    >
                      Cancelar
                    </SecondaryButton>
                    <PrimaryButton
                      type="button"
                      disabled={isUpdating}
                      onClick={async (e) => {
                        e.preventDefault();
                        if (!editingSede) return;
                        try {
                          setIsUpdating(true);

                          const newImagePaths: string[] = [];

                          // Add new images if any
                          if (editImagenes.length > 0) {
                            for (const img of editImagenes) {
                              const addResponse =
                                await sedesApiClient.addSedeImage(
                                  editingSede.id,
                                  img,
                                );
                              if (!addResponse.ok) {
                                throw new Error("Error al agregar imágenes");
                              }
                              // Get the new image path from response
                              if (addResponse.data?.imagenes) {
                                const allImages = addResponse.data.imagenes;
                                const newImages = allImages.slice(
                                  -editImagenes.length,
                                );
                                newImagePaths.push(...newImages);
                              }
                            }
                          }

                          // Update state to show new images
                          setEditExistingImages((prev) => [
                            ...prev,
                            ...newImagePaths,
                          ]);
                          setEditingSede((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  imagenes: [
                                    ...prev.imagenes,
                                    ...newImagePaths,
                                  ],
                                }
                              : null,
                          );
                          setEditImagenes([]);

                          setNotification({
                            show: true,
                            message: "Imágenes actualizadas",
                            type: "success",
                          });
                          setTimeout(
                            () =>
                              setNotification((p) => ({ ...p, show: false })),
                            3000,
                          );
                        } catch (error) {
                          console.error("Error updating images:", error);
                          setNotification({
                            show: true,
                            message: "No se pudieron actualizar las imágenes",
                            type: "error",
                          });
                          setTimeout(
                            () =>
                              setNotification((p) => ({ ...p, show: false })),
                            3000,
                          );
                        } finally {
                          setIsUpdating(false);
                        }
                      }}
                    >
                      {isUpdating ? "Actualizando..." : "Actualizar imágenes"}
                    </PrimaryButton>
                  </Row>
                </Field>
              </FormGrid>
            )}
          </ModalContent>
        </ModalOverlay>
      )}

      {notification.show && (
        <NotificationBanner $type={notification.type}>
          {notification.message}
        </NotificationBanner>
      )}
    </Container>
  );
}
