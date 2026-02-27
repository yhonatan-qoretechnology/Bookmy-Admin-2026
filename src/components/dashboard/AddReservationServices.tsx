import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  ServiceAccordionItem,
  type ServiceOption,
} from "./ServiceAccordionItem";
import { SpecialistSelector, type Specialist } from "./SpecialistSelector";

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
    const apiBase = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
    const logoFallback = "/logo.png";
    return professionals.map((p) => {
      let imagePath = logoFallback;
      if (p.imagen) {
        const cleanPath = p.imagen.startsWith("/") ? p.imagen : `/${p.imagen}`;
        imagePath = `${apiBase}${cleanPath}`;
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

  const handleNext = () => {
    if (!selectedUser) {
      alert("Por favor selecciona un cliente antes de continuar");
      return;
    }

    if (selectedServiceId && selectedSpecialistId) {
      // Buscar nombres y precios para enviar al padre
      const selectedProf = professionals.find(
        (p) => String(p.id) === selectedSpecialistId,
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
        serviceId: selectedServiceId,
        specialistId: selectedSpecialistId,
        serviceName: selectedSvcName,
        price: selectedSvcPrice,
        duration: selectedSvcDuration,
        specialistName: selectedProf?.nombre || "",
      });
    } else {
      alert("Por favor selecciona un servicio y un especialista");
    }
  };

  return (
    <Container>
      <MainTitle>
        Selecciona el servicio y<br />
        especialista
      </MainTitle>

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
      />

      <Footer>
        <BackButton onClick={onBack}>Regresar</BackButton>
        <NextButton onClick={handleNext}>Siguiente</NextButton>
      </Footer>
    </Container>
  );
}
