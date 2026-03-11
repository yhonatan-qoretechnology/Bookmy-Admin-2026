import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  ServiceAccordionItem,
  type ServiceOption,
} from "./ServiceAccordionItem";
import { SpecialistSelector, type Specialist } from "./SpecialistSelector";

// Componente de alerta bonita
const AlertOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
`;

const AlertContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CancelButton = styled.button`
  background: #e5e7eb;
  color: #374151;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 0.5rem;

  &:hover {
    background: #d1d5db;
  }
`;

const AlertTitle = styled.h3`
  color: #1a202c;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const AlertMessage = styled.p`
  color: #4a5568;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const AlertButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }
`;

interface Price {
  id: number;
  amount: number;
  duration: number;
  currency: string;
}

interface ServiceItem {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  precios: Price[];
}

interface ProfessionalBySede {
  id: number;
  nombre: string;
  biografia: string;
  imagen: string;
  telefono: string;
  state: string;
  sedeId: number;
  servicios: ServiceItem[];
}

interface Category {
  id: string;
  title: string;
  count: string;
  items: ServiceOption[];
}

interface AddReservationServicesProps {
  onBack: () => void;
  onNext: (data: {
    serviceId: string;
    specialistId: string;
    serviceName: string;
    price: string;
    duration: number;
    specialistName: string;
  }) => void;
  selectedUser?: { id: string; name: string; email: string } | null;
}

const Container = styled.div`
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-top: 1rem;
  text-align: center;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
`;

const MainTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 3rem;
  line-height: 1.3;
`;

const ServicesGrid = styled.div<{ $isUpdating?: boolean }>`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  transition: opacity 0.3s ease;
  opacity: ${({ $isUpdating }) => ($isUpdating ? 0.5 : 1)};

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 4rem;
  border-top: 1px solid #f3f4f6;
  padding-top: 2rem;
`;

const ButtonBase = styled.button`
  padding: 0.8rem 2.5rem;
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

const NextButton = styled(ButtonBase)`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
`;

export function AddReservationServices({
  onBack,
  onNext,
  selectedUser,
}: AddReservationServicesProps) {
  const [selectedServiceId, setSelectedServiceId] = useState<
    string | undefined
  >();
  const [selectedSpecialistId, setSelectedSpecialistId] = useState<
    string | undefined
  >();
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  const [professionals, setProfessionals] = useState<ProfessionalBySede[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        const sedeId = user?.AdminProfile?.sedeId;
        const apiBase = import.meta.env.VITE_API_BASE_URL;

        if (!sedeId || !apiBase) return;

        const url = `${apiBase.replace(/\/$/, "")}/profesionales/by-sede/${sedeId}?lang=es`;
        const res = await fetch(url);
        if (res.ok) {
          const data: ProfessionalBySede[] = await res.json();
          setProfessionals(data || []);
        }
      } catch (error) {
        console.error("Error fetching professionals:", error);
      }
    };

    fetchProfessionals();
  }, []);

  const specialists: Specialist[] = useMemo(() => {
    const logoFallback = "/logo.png";

    const uploadsBase = (
      (import.meta.env as { VITE_API_BASE_URL_IMG?: string })
        .VITE_API_BASE_URL_IMG || "https://bookmy.es"
    ).replace(/\/$/, "");

    return professionals.map((p) => {
      let imagePath = logoFallback;
      if (p.imagen) {
        const raw = String(p.imagen);
        if (/^https?:\/\//i.test(raw)) {
          imagePath = raw;
        } else if (raw.startsWith("//")) {
          imagePath = `https:${raw}`;
        } else if (/^[a-z0-9.-]+\.[a-z]{2,}(\/|$)/i.test(raw)) {
          imagePath = `https://${raw}`;
        } else {
          const cleanPath = raw.startsWith("/") ? raw : `/${raw}`;
          imagePath = `${uploadsBase}${cleanPath}`;
        }
      }
      return {
        id: String(p.id),
        name: p.nombre,
        role: p.biografia || "Profesional",
        image: imagePath,
      };
    });
  }, [professionals]);

  const categories: Category[] = useMemo(() => {
    let servicesToShow: ServiceItem[] = [];

    if (selectedSpecialistId) {
      const selectedProf = professionals.find(
        (p) => String(p.id) === selectedSpecialistId,
      );
      servicesToShow = selectedProf?.servicios || [];
      console.log(
        `Filtrando servicios para el profesional ${selectedProf?.nombre}:`,
        servicesToShow.map((s) => s.nombre),
      );
    } else {
      const allServicesMap = new Map<number, ServiceItem>();
      professionals.forEach((p) => {
        p.servicios.forEach((s) => {
          allServicesMap.set(s.id, s);
        });
      });
      servicesToShow = Array.from(allServicesMap.values());
      console.log(
        `Mostrando todos los servicios de la sede (${servicesToShow.length} totales)`,
      );
    }

    if (servicesToShow.length === 0) return [];

    const groups: Record<string, Category> = {};

    servicesToShow.forEach((svc) => {
      const catKey = svc.categoria || "Otros";

      if (!groups[catKey]) {
        groups[catKey] = {
          id: catKey,
          title: catKey,
          count: "0 servicios",
          items: [],
        };
      }

      const price = svc.precios?.[0]?.amount;
      groups[catKey].items.push({
        id: String(svc.id),
        name: svc.nombre,
        price: typeof price === "number" ? `${price.toFixed(2)}€` : "0€",
      });
    });

    return Object.values(groups).map((cat) => ({
      ...cat,
      count: `${cat.items.length} servicios`,
    }));
  }, [professionals, selectedSpecialistId]);

  const handleServiceSelect = (service: ServiceOption) => {
    setSelectedServiceId(service.id);
  };

  const handleSpecialistSelect = (id: string) => {
    setIsUpdating(true);
    setSelectedSpecialistId((prev) => {
      const nextId = prev === id ? undefined : id;
      console.log(
        `Cambiando profesional: de ${prev || "Ninguno"} a ${
          nextId || "Ninguno (Lista completa)"
        }`,
      );
      setSelectedServiceId(undefined);
      return nextId;
    });
    // Pequeño delay para que la transición sea visible
    setTimeout(() => setIsUpdating(false), 300);
  };

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [shouldAssignOnClose, setShouldAssignOnClose] = useState(false);

  const openNiceModal = (message: string, assignOnClose: boolean) => {
    setAlertMessage(message);
    setShouldAssignOnClose(assignOnClose);
    setShowAlert(true);
  };

  const closeNiceModal = () => {
    setShowAlert(false);
  };

  const assignRandomSpecialistForSelectedService = () => {
    let availableSpecialists = professionals;

    if (selectedServiceId) {
      availableSpecialists = professionals.filter((p) =>
        p.servicios.some((s) => String(s.id) === selectedServiceId),
      );
    }

    if (availableSpecialists.length === 0) {
      openNiceModal(
        "No hay especialistas disponibles para este servicio",
        false,
      );
      return;
    }

    const randomSpecialist =
      availableSpecialists[
        Math.floor(Math.random() * availableSpecialists.length)
      ];
    const id = String(randomSpecialist.id);
    setSelectedSpecialistId(id);
    proceedWithReservation(id);
  };

  const handleNext = () => {
    // 1. Validar Usuario (Cliente) primero
    if (!selectedUser) {
      openNiceModal(
        "Por favor, busca y selecciona un cliente en el campo 'Buscar por email o documento' antes de continuar.",
        false,
      );
      return;
    }

    if (!selectedServiceId) {
      openNiceModal("Por favor selecciona un servicio", false);
      return;
    }

    if (selectedSpecialistId) {
      proceedWithReservation(selectedSpecialistId);
      return;
    }

    openNiceModal(
      "No ha seleccionado un especialista. Al dar en Entendido se asignará uno aleatoriamente para el servicio seleccionado.",
      true,
    );
  };

  const proceedWithReservation = (specialistIdToUse: string) => {
    // Buscar nombres y precios para enviar al padre
    const selectedProf = professionals.find(
      (p) => String(p.id) === specialistIdToUse,
    );
    let selectedSvcName = "";
    let selectedSvcPrice = "";
    let selectedSvcDuration = 30;

    professionals.forEach((p) => {
      const svc = p.servicios.find((s) => String(s.id) === selectedServiceId);
      if (svc) {
        selectedSvcName = svc.nombre;
        selectedSvcPrice =
          typeof svc.precios?.[0]?.amount === "number"
            ? `${svc.precios[0].amount.toFixed(2)}€`
            : "0€";
        selectedSvcDuration =
          typeof svc.precios?.[0]?.duration === "number"
            ? svc.precios[0].duration
            : 30;
      }
    });

    onNext({
      serviceId: selectedServiceId || "",
      specialistId: specialistIdToUse,
      serviceName: selectedSvcName,
      price: selectedSvcPrice,
      duration: selectedSvcDuration,
      specialistName: selectedProf?.nombre || "",
    });
  };

  return (
    <Container>
      <MainTitle>Selecciona el servicio y especialista</MainTitle>

      <ServicesGrid $isUpdating={isUpdating}>
        {categories.map((cat) => (
          <ServiceAccordionItem
            key={cat.id}
            title={cat.title}
            countText={cat.count}
            services={cat.items}
            selectedServiceId={selectedServiceId}
            onSelectService={handleServiceSelect}
            isOpen={openCategoryId === cat.id}
            onToggle={() => {
              console.log(
                "Click en categoría:",
                cat.id,
                "openCategoryId actual:",
                openCategoryId,
              );
              const newOpenId = openCategoryId === cat.id ? null : cat.id;
              console.log("Nuevo openCategoryId:", newOpenId);
              setOpenCategoryId(newOpenId);
            }}
          />
        ))}
      </ServicesGrid>

      <SpecialistSelector
        specialists={specialists}
        selectedId={selectedSpecialistId}
        onSelect={handleSpecialistSelect}
        loading={professionals.length === 0}
      />

      <Footer>
        <BackButton onClick={onBack}>Regresar</BackButton>
        <NextButton onClick={handleNext}>Siguiente</NextButton>
      </Footer>

      {showAlert && (
        <AlertOverlay
          onClick={() => {
            // Si estamos en modo de asignación, forzamos que se haga por el botón.
            if (!shouldAssignOnClose) {
              closeNiceModal();
            }
          }}
        >
          <AlertContent onClick={(e) => e.stopPropagation()}>
            <AlertTitle>Información</AlertTitle>
            <AlertMessage>{alertMessage}</AlertMessage>
            {shouldAssignOnClose ? (
              <div>
                <CancelButton
                  type="button"
                  onClick={() => {
                    closeNiceModal();
                    setShouldAssignOnClose(false);
                  }}
                >
                  Cancelar
                </CancelButton>
                <AlertButton
                  type="button"
                  onClick={() => {
                    closeNiceModal();
                    assignRandomSpecialistForSelectedService();
                  }}
                >
                  Entendido
                </AlertButton>
              </div>
            ) : (
              <AlertButton
                type="button"
                onClick={() => {
                  closeNiceModal();
                }}
              >
                Entendido
              </AlertButton>
            )}
          </AlertContent>
        </AlertOverlay>
      )}
    </Container>
  );
}
