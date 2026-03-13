import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { StatusBadge } from "../components/common/StatusBadge";
import { DayReservations } from "../components/dashboard/DayReservations";
import { CalendarWidget } from "../components/dashboard/CalendarWidget";
import { DatePicker } from "../components/common/DatePicker";
import { CustomDropdown } from "../components/common/CustomDropdown";
import { AddReservationCalendar } from "../components/dashboard/AddReservationCalendar";
import { AddReservationTime } from "../components/dashboard/AddReservationTime";
import { AddReservationServices } from "../components/dashboard/AddReservationServices";
import { AddReservationConfirm } from "../components/dashboard/AddReservationConfirm";
import {
  CreateClientForm,
  type ClientFormData,
} from "../components/dashboard/CreateClientForm";
import { AddAdminType } from "../components/dashboard/AddAdminType";
import { AddAdminForm } from "../components/dashboard/AddAdminForm";
import { AddAdminConfirm } from "../components/dashboard/AddAdminConfirm";
import { AdminList } from "../components/dashboard/AdminList";
import { EmpresasModule } from "../components/empresas/EmpresasModule";
import { useAuthGuard } from "../presentation/hooks/useAuthGuard";
import Swal from "sweetalert2";

import filterIcon from "../assets/icons/filter.svg";
import refreshIcon from "../assets/icons/refresh.svg";
import closeIcon from "../assets/icons/close-circle.svg";
import chevronDownIcon from "../assets/icons/chevron-down.svg";

// API imports
import { FetchHttpClient } from "../api/http/FetchHttpClient";
import { AdminApiClient } from "../api/clients/AdminApiClient";
import { ClientApiClient } from "../api/clients/ClientApiClient";
import { AppointmentsApiClient } from "../api/clients/AppointmentsApiClient";
import { ServicesApiClient } from "../api/clients/ServicesApiClient";
import { SedesApiClient, type Sede } from "../api/clients/SedesApiClient";
import type { Admin } from "../core/domain/admin/AdminTypes";
import type { Client } from "../core/domain/client/ClientTypes";
import type { Appointment } from "../api/clients/AppointmentsApiClient";
import type { Category } from "../api/clients/ServicesApiClient";

type AdminFormData = {
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
};

const httpClient = new FetchHttpClient();
const sedesApiClient = new SedesApiClient(httpClient);
const adminApiClient = new AdminApiClient(httpClient);
const clientApiClient = new ClientApiClient(httpClient);
const appointmentsApiClient = new AppointmentsApiClient(httpClient);
const servicesApiClient = new ServicesApiClient(httpClient);

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;
const PageTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;
const SubTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin-bottom: 1.5rem;
`;
const SedeButton = styled.button`
  background-color: #66cdaa;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 500;
  &:hover {
    opacity: 0.9;
  }
`;
const SectionContainer = styled.section`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
  margin-bottom: 2rem;
`;
const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;
const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;
const DateFilter = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: white;
  color: ${({ theme }) => theme.textLight};
  outline: none;
`;
const TableWrapper = styled.div`
  overflow-x: auto;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
`;
const Th = styled.th`
  text-align: left;
  padding: 1rem;
  background-color: #f5f6fa;
  color: ${({ theme }) => theme.text};
  font-weight: bold;
  font-size: 0.9rem;
  &:first-child {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }
  &:last-child {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;
const Tr = styled.tr`
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
`;
const Td = styled.td`
  padding: 1.5rem 1rem;
  color: ${({ theme }) => theme.textLight};
  font-size: 0.9rem;
  vertical-align: middle;
`;
const PriceText = styled.span`
  color: ${({ theme }) => theme.primary};
  font-weight: bold;
`;
const ClientName = styled.span`
  color: ${({ theme }) => theme.text};
  font-weight: 500;
`;
const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;
const PlaceholderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  color: ${({ theme }) => theme.textLight};
`;

const FilterBar = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;
const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;
const FilterIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
`;
const FilterLabel = styled.span`
  font-weight: bold;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text};
  margin-right: 0.5rem;
`;
const FilterTrigger = styled.div`
  position: relative;
  background-color: #f9fafb;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 0.6rem 1rem;
  min-width: 160px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
  span {
    font-weight: 600;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.text};
  }
`;
const ResetButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.danger};
  font-weight: bold;
  cursor: pointer;
  padding: 0.5rem 1rem;
  img {
    width: 16px;
  }
`;
const AddReservationBtn = styled.button`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

const EditButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.85rem;

  &:hover {
    background: #2563eb;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const DeleteAdminButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.85rem;
  margin-left: 0.5rem;

  &:hover {
    background: #dc2626;
  }

  &:active {
    transform: scale(0.98);
  }
`;
const ServiceColumn = styled.div`
  display: flex;
  flex-direction: column;
`;
const SpecialistText = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.textLight};
  margin-top: 4px;
`;
const StatusCell = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;
const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 24px;
    height: 24px;
    transition: transform 0.2s;
  }
  &:hover img {
    transform: scale(1.1);
  }
`;

export function DashboardPage() {
  useAuthGuard(); // Protege esta ruta

  const [activeTab, setActiveTab] = useState("Dashboard");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole: string | undefined = user?.role;
  const userEmpresaId: number | undefined = user?.AdminProfile?.empresaId;
  const userSedeId: number | undefined = user?.AdminProfile?.sedeId;

  const isSuperAdmin = userRole === "SUPER_ADMIN";
  const isCompanyAdmin = userRole === "COMPANY_ADMIN";
  const isBranchAdmin = userRole === "BRANCH_ADMIN";

  const [companies, setCompanies] = useState<{ id: number; nombre: string }[]>(
    [],
  );
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<number | null>(
    isSuperAdmin ? null : (userEmpresaId ?? null),
  );
  const [sedesByEmpresa, setSedesByEmpresa] = useState<Sede[]>([]);
  const [selectedSedeId, setSelectedSedeId] = useState<number | null>(
    isBranchAdmin ? (userSedeId ?? null) : null,
  );

  const effectiveSedeId: number | undefined =
    selectedSedeId ?? (isBranchAdmin ? userSedeId : undefined);

  // Estado para el nombre de la sede actual
  const [sedeName, setSedeName] = useState<string>("Cargando sede...");

  const [isAddingReservation, setIsAddingReservation] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingDetails, setBookingDetails] = useState({
    date: null as Date | null,
    time: null as string | null,
    serviceName: "Manicura Semipermanente SPA",
    price: "21.00€",
    duration: 30,
    specialistId: "" as string,
    specialistName: "" as string,
    serviceId: "" as string,
  });

  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string;
    email: string;
    phone?: string;
    document?: string;
  } | null>(null);

  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [adminStep, setAdminStep] = useState(1);
  const [adminType, setAdminType] = useState<"company" | "branch" | null>(null);
  const [adminData, setAdminData] = useState<AdminFormData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [servicesList, setServicesList] = useState<
    { id: number; name: string }[]
  >([]);
  const [selectedService, setSelectedService] = useState<{
    id: number | null;
    name: string;
  }>({ id: null, name: "Servicio" });

  const [selectedTime, setSelectedTime] = useState("Hora");
  const [isTimeOpen, setIsTimeOpen] = useState(false);

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [editingAdminId, setEditingAdminId] = useState<number | null>(null);

  const [latestAppointments, setLatestAppointments] = useState<Appointment[]>(
    [],
  );
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);

  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [isLoadingFilteredAppointments, setIsLoadingFilteredAppointments] =
    useState(false);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] =
    useState<Appointment | null>(null);
  const [isCancellingAppointment, setIsCancellingAppointment] = useState(false);

  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);

  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const [clientFormData, setClientFormData] = useState<ClientFormData | null>(
    null,
  );

  const [quickClientSearch, setQuickClientSearch] = useState("");
  const [isSearchingQuickClient, setIsSearchingQuickClient] = useState(false);
  const [clientNotFound, setClientNotFound] = useState(false);
  const clientSearchInputRef = useRef<HTMLInputElement>(null);

  // Focus on client search input when validation fails
  useEffect(() => {
    if (clientNotFound && clientSearchInputRef.current) {
      setTimeout(() => {
        clientSearchInputRef.current?.focus();
      }, 100);
    }
  }, [clientNotFound]);

  useEffect(() => {
    if (user.role === "BRANCH_ADMIN") return;

    const fetchAdmins = async () => {
      try {
        const response = await adminApiClient.getAdmins();
        setAdmins(response.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAdmins();
  }, [user.role]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        if (!isSuperAdmin) return;

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/empresas`,
        );
        const data = await response.json();
        setCompanies(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching companies:", error);
        setCompanies([]);
      }
    };

    fetchCompanies();
  }, [isSuperAdmin]);

  useEffect(() => {
    const fetchSedes = async () => {
      try {
        if (!selectedEmpresaId) {
          setSedesByEmpresa([]);
          if (!isBranchAdmin) setSelectedSedeId(null);
          return;
        }

        const response =
          await sedesApiClient.getSedesByEmpresaId(selectedEmpresaId);
        const sedes = response.data || [];
        setSedesByEmpresa(sedes);

        // Si el usuario es COMPANY_ADMIN, por defecto seleccionamos la sede asignada (si existe)
        if (isCompanyAdmin && userSedeId) {
          setSelectedSedeId(userSedeId);
        }
      } catch (error) {
        console.error("Error fetching sedes:", error);
        setSedesByEmpresa([]);
        if (!isBranchAdmin) setSelectedSedeId(null);
      }
    };

    fetchSedes();
  }, [selectedEmpresaId, isBranchAdmin, isCompanyAdmin, userSedeId]);

  // Load filtered appointments for "Listado de reservas"
  useEffect(() => {
    const fetchFilteredAppointments = async () => {
      try {
        setIsLoadingFilteredAppointments(true);

        const params: {
          sedeId?: number;
          date?: string;
          startDate?: string;
          endDate?: string;
          serviceId?: number;
          hour?: string;
          page?: number;
          limit?: number;
        } = {};

        if (effectiveSedeId) {
          params.sedeId = effectiveSedeId;
        }

        // Si se seleccionó una fecha específica, usar date. Si no, usar rango mensual.
        if (selectedDate) {
          params.date = selectedDate.toISOString().split("T")[0];
        } else {
          const now = new Date();
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          params.startDate = startOfMonth.toISOString().split("T")[0];
          params.endDate = endOfMonth.toISOString().split("T")[0];
        }

        // Filtro de servicio
        if (selectedService.id !== null) {
          params.serviceId = selectedService.id;
        }

        // Filtro de hora
        if (selectedTime && selectedTime !== "Hora") {
          // Extraer la primera hora del rango (ej. "7:00 am - 8:00 am" -> "7:00 am")
          const timePart = selectedTime.split("-")[0].trim().toLowerCase();

          // Regex para capturar horas y minutos
          const match = timePart.match(/(\d{1,2}):(\d{2})/);
          if (match) {
            let hours = parseInt(match[1]);
            const minutes = match[2];
            const isPM = timePart.includes("pm");
            const isAM = timePart.includes("am");

            if (isPM && hours < 12) hours += 12;
            if (isAM && hours === 12) hours = 0;

            params.hour = `${hours.toString().padStart(2, "0")}:${minutes}`;
          }
        }

        params.limit = 100;

        const response =
          await appointmentsApiClient.getFilteredAppointments(params);
        setFilteredAppointments(response.data.items || []);
      } catch (error) {
        console.error("Error loading filtered appointments:", error);
        setFilteredAppointments([]);
      } finally {
        setIsLoadingFilteredAppointments(false);
      }
    };

    fetchFilteredAppointments();
  }, [effectiveSedeId, selectedDate, selectedService, selectedTime]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoadingClients(true);
        const response = await clientApiClient.getClients();
        setClients(response.data || []);
      } catch (error) {
        console.error("Error loading clients:", error);
        setClients([]);
      } finally {
        setIsLoadingClients(false);
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    const fetchLatestAppointments = async () => {
      try {
        setIsLoadingAppointments(true);
        if (!effectiveSedeId) {
          setLatestAppointments([]);
          return;
        }

        const response = await appointmentsApiClient.getLatestAppointments(
          effectiveSedeId,
          5, //limite de dec argas de citas
        );
        setLatestAppointments(response.data || []);
      } catch (error) {
        console.error("Error loading appointments:", error);
        setLatestAppointments([]);
      } finally {
        setIsLoadingAppointments(false);
      }
    };
    fetchLatestAppointments();
  }, [effectiveSedeId]);

  // Load services/categories from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await servicesApiClient.getCategories();
        const categories = response.data || [];
        // Map category names and IDs to servicesList
        setServicesList(
          categories.map((cat: Category) => ({
            id: cat.id,
            name: cat.translations[0]?.name || "Sin nombre",
          })),
        );
      } catch (error) {
        console.error("Error loading services:", error);
        setServicesList([]);
      }
    };
    fetchServices();
  }, []);

  // Load sede name based on user's sedeId
  useEffect(() => {
    const fetchSedeName = async () => {
      try {
        if (!effectiveSedeId || !selectedEmpresaId) {
          setSedeName("Sede no asignada");
          return;
        }

        // Fetch all sedes for this empresa and find the matching one
        const response =
          await sedesApiClient.getSedesByEmpresaId(selectedEmpresaId);
        const sedes = response.data || [];
        const userSede = sedes.find((sede) => sede.id === effectiveSedeId);

        if (userSede) {
          setSedeName(userSede.nombre);
        } else {
          setSedeName("Sede no encontrada");
        }
      } catch (error) {
        console.error("Error loading sede:", error);
        setSedeName("Error al cargar sede");
      }
    };
    fetchSedeName();
  }, [effectiveSedeId, selectedEmpresaId]);

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleString("es-ES", { month: "short" });
    const year = date.getFullYear();
    const monthCap = month.charAt(0).toUpperCase() + month.slice(1);
    return `${day} ${monthCap} ${year}`;
  };

  const handleStartBooking = () => {
    // Nuevo flujo: primero seleccionar servicio y especialista
    setBookingStep(1);
    setSelectedUser(null);
    setIsAddingReservation(true);
  };

  const handleServiceSelected = (data: {
    serviceId: string;
    specialistId: string;
    serviceName: string;
    price: string;
    duration: number;
    specialistName: string;
  }) => {
    setBookingDetails((prev) => ({
      ...prev,
      serviceId: data.serviceId,
      serviceName: data.serviceName || prev.serviceName,
      price: data.price || prev.price,
      duration:
        typeof data.duration === "number" ? data.duration : prev.duration,
      specialistId: data.specialistId,
      specialistName: data.specialistName || "",
    }));
    // Después de elegir servicio/profesional, ir a selección de fecha
    setBookingStep(2);
  };

  const handleDateSelected = (date: Date) => {
    console.log(
      "Fecha seleccionada y guardada en el flujo:",
      date.toLocaleDateString(),
    );
    setBookingDetails((prev) => ({ ...prev, date }));
    // Después de elegir fecha, ir a selección de hora
    setBookingStep(3);
  };

  const handleTimeSelected = (time: string) => {
    setBookingDetails((prev) => ({ ...prev, time }));
    // Después de elegir hora, ir a la pantalla de confirmación
    setBookingStep(4);
  };

  const handleFinalSubmit = (customerData: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
  }) => {
    // Al finalizar, recogemos todos los datos (del caché/estado local) y los mandamos a guardar
    const payload = {
      userId: selectedUser?.id,
      cliente: {
        ...customerData,
        id: selectedUser?.id,
      },
      servicioId: bookingDetails.serviceId,
      especialistaId: bookingDetails.specialistId,
      fecha: bookingDetails.date,
      hora: bookingDetails.time,
      sedeId: effectiveSedeId,
    };

    console.log("RESERVA CREADA (PAYLOAD FINAL):", payload);

    setIsAddingReservation(false);
    setBookingStep(1);
    setSelectedUser(null);
    setBookingDetails({
      date: null,
      time: null,
      serviceName: "Manicura Semipermanente SPA",
      price: "21.00€",
      duration: 30,
      specialistId: "",
    });
  };

  // Autocomplete for client search - ELIMINADO para usar solo botón

  const handleCreateUser = (
    searchValue: string,
    searchType: "email" | "document",
  ) => {
    // Start client creation flow with pre-filled data (stay in Reservas tab)
    setClientFormData({
      name: "",
      email: searchType === "email" ? searchValue : "",
      phone: "",
      password: "",
      gender: "Masculino",
      birthdate: "1990-01-15",
      firstName: "",
      lastName: "",
      categoryIds: "1,5,10",
      fotoPerfil: null,
    });
    setIsCreatingClient(true);
    // No cambiamos de tab - nos quedamos en Reservas
  };

  const handleStartCreatingClient = () => {
    setClientFormData(null);
    setIsCreatingClient(true);
  };

  const handleClientFormSubmit = async (data: ClientFormData) => {
    try {
      // Create FormData for multipart/form-data submission
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("password", data.password);
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("gender", data.gender);
      formData.append("birthdate", data.birthdate);
      // Default values for admin registration
      formData.append("empresaId", "0");
      formData.append("sedeId", "0");
      formData.append("countryId", "1");
      formData.append("clientType", "people");
      formData.append("role", "CLIENT");
      formData.append("state", "enabled"); // Directo a activo desde admin
      formData.append("acceptTerms", "true");
      formData.append("acceptPolitics", "true");
      formData.append("idioma", "es");
      formData.append("categoryIds", data.categoryIds || "1,5,10");

      if (data.fotoPerfil) {
        formData.append("fotoPerfil", data.fotoPerfil);
      }

      const response = await clientApiClient.registerClient(formData);
      const newUser = response.data.user;

      // Create a Client object from the user response
      const newClient: Client = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.UserData.name,
        phone: newUser.UserData.phone,
        state: newUser.state,
        clientType: newUser.clientType,
        createdAt: new Date().toISOString(),
      };

      // Update clients list
      setClients((prev) => [...prev, newClient]);

      alert("Cliente creado exitosamente");

      // If we were in reservation flow, go back to user search
      if (activeTab === "Reservas") {
        setIsCreatingClient(false);
        setBookingStep(2); // Back to user search step
      } else {
        setIsCreatingClient(false);
      }
    } catch (error) {
      console.error("Error creating client:", error);
      alert("Error al crear el cliente");
    }
  };

  const handleCancelClientCreation = () => {
    setIsCreatingClient(false);
    setClientFormData(null);

    // If we were in reservation flow, go back to user search
    if (activeTab === "Reservas") {
      setBookingStep(2);
    }
  };

  const handleStartAddingAdmin = () => {
    setAdminStep(1);
    setAdminType(null);
    setAdminData(null);
    setIsAddingAdmin(true);
    setIsEditing(false);
    setSelectedAdmin(null);
  };

  const handleEdit = async (admin: Admin) => {
    setEditingAdminId(admin.id);
    setIsEditing(true);

    try {
      const fullAdmin = await adminApiClient.getAdminById(admin.id);
      const nextType = fullAdmin.role === "BRANCH_ADMIN" ? "branch" : "company";
      setAdminType(nextType);
      setAdminData({
        firstName: fullAdmin.AdminProfile?.firstName ?? "",
        lastName: fullAdmin.AdminProfile?.lastName ?? "",
        name: fullAdmin.UserData?.name ?? "",
        email: fullAdmin.email ?? "",
        password: "", // Leave empty for editing
        phone: fullAdmin.AdminProfile?.phone ?? "",
        countryId: fullAdmin.UserData?.countryId ?? 1,
        idioma: fullAdmin.UserData?.idioma ?? "es",
        gender: fullAdmin.UserData?.gender ?? "femenino",
        birthdate: fullAdmin.UserData?.birthdate
          ? fullAdmin.UserData.birthdate.split("T")[0]
          : "",
        empresaId: fullAdmin.AdminProfile?.empresaId ?? 0,
        sedeId: fullAdmin.AdminProfile?.sedeId ?? undefined,
        clientType: fullAdmin.clientType ?? "business",
        state: fullAdmin.state ?? "enabled",
        role: fullAdmin.role ?? "",
        photoFile: undefined, // Can't preload file
      });
    } catch (error) {
      console.error("Error fetching admin for edit:", error);
      setAdminType(admin.role === "BRANCH_ADMIN" ? "branch" : "company");
      setAdminData({
        firstName: admin.AdminProfile.firstName,
        lastName: admin.AdminProfile.lastName,
        name: admin.UserData.name,
        email: admin.email,
        password: "", // Leave empty for editing
        phone: admin.AdminProfile.phone ?? "",
        countryId: admin.UserData.countryId,
        idioma: admin.UserData.idioma ?? "",
        gender: admin.UserData.gender ?? "",
        birthdate: admin.UserData.birthdate
          ? admin.UserData.birthdate.split("T")[0]
          : "",
        empresaId: admin.AdminProfile.empresaId,
        sedeId: admin.AdminProfile.sedeId || undefined,
        clientType: admin.clientType,
        state: admin.state,
        role: admin.role,
        photoFile: undefined, // Can't preload file
      });
    }
    setAdminStep(2);
    setIsAddingAdmin(true);
    setActiveTab("Crear administradores");
  };

  const handleDeleteAdmin = async (adminId: number) => {
    const result = await Swal.fire({
      title: "¿Eliminar administrador?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;

    try {
      await adminApiClient.deleteAdmin(adminId);
      // Update state to remove deleted admin instead of reloading page
      setAdmins((prev) => prev.filter((admin) => admin.id !== adminId));
      await Swal.fire({
        icon: "success",
        title: "Eliminado",
        text: "Administrador eliminado con éxito",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error deleting admin:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar el administrador",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handleAdminTypeSelected = (type: "company" | "branch") => {
    setAdminType(type);
    setAdminStep(2);
  };

  const handleAdminFormSubmitted = (data: AdminFormData) => {
    setAdminData(data);
    setAdminStep(3);
  };

  const handleAdminConfirm = async () => {
    try {
      if (isEditing && editingAdminId) {
        // Update existing admin
        const formData = new FormData();

        // Only append fields that are provided (partial update)
        if (adminData.firstName)
          formData.append("firstName", adminData.firstName);
        if (adminData.lastName) formData.append("lastName", adminData.lastName);
        if (adminData.name) formData.append("name", adminData.name);
        if (adminData.email) formData.append("email", adminData.email);
        if (adminData.password) formData.append("password", adminData.password);
        if (adminData.phone) formData.append("phone", adminData.phone);
        if (adminData.gender) formData.append("gender", adminData.gender);
        if (adminData.birthdate)
          formData.append("birthdate", adminData.birthdate);
        if (adminData.empresaId !== undefined)
          formData.append("empresaId", String(adminData.empresaId));
        if (adminData.sedeId !== undefined)
          formData.append("sedeId", String(adminData.sedeId));
        if (adminData.clientType)
          formData.append("clientType", adminData.clientType);
        if (adminData.state) formData.append("state", adminData.state);
        if (adminData.countryId !== undefined)
          formData.append("countryId", String(adminData.countryId));
        if (adminData.idioma) formData.append("idioma", adminData.idioma);
        if (adminData.role) formData.append("role", adminData.role);

        if (adminData.photoFile) {
          formData.append("photoFile", adminData.photoFile);
        }

        await adminApiClient.updateAdmin(editingAdminId, formData);
      } else {
        // Create new admin
        if (adminType === "company") {
          const companyPayload = Object.fromEntries(
            Object.entries(adminData).filter(([key]) => key !== "sedeId"),
          ) as unknown as AdminFormData;

          const formData = new FormData();
          formData.append("firstName", companyPayload.firstName);
          formData.append("lastName", companyPayload.lastName);
          formData.append("name", companyPayload.name);
          formData.append("email", companyPayload.email);
          formData.append("password", companyPayload.password);
          formData.append("phone", companyPayload.phone);
          formData.append("gender", companyPayload.gender);
          formData.append("birthdate", companyPayload.birthdate);
          formData.append("empresaId", String(companyPayload.empresaId));
          formData.append("clientType", companyPayload.clientType);
          formData.append("state", companyPayload.state);
          formData.append("countryId", String(companyPayload.countryId));
          formData.append("idioma", companyPayload.idioma);
          formData.append("role", companyPayload.role);

          if (companyPayload.photoFile) {
            formData.append("photoFile", companyPayload.photoFile);
          }

          await adminApiClient.createCompanyAdmin(
            companyPayload.empresaId,
            formData,
          );
        } else if (adminType === "branch") {
          if (!adminData.sedeId) {
            alert("Selecciona una sede válida");
            return;
          }

          const formData = new FormData();
          formData.append("firstName", adminData.firstName);
          formData.append("lastName", adminData.lastName);
          formData.append("name", adminData.name);
          formData.append("email", adminData.email);
          formData.append("password", adminData.password);
          formData.append("phone", adminData.phone);
          formData.append("gender", adminData.gender);
          formData.append("birthdate", adminData.birthdate);
          formData.append("empresaId", String(adminData.empresaId));
          formData.append("sedeId", String(adminData.sedeId));
          formData.append("clientType", adminData.clientType);
          formData.append("state", adminData.state);
          formData.append("countryId", String(adminData.countryId));
          formData.append("idioma", adminData.idioma);
          formData.append("role", adminData.role);

          if (adminData.photoFile) {
            formData.append("photoFile", adminData.photoFile);
          }

          await adminApiClient.createBranchAdmin(adminData.sedeId, formData);
        }
      }

      await Swal.fire({
        icon: "success",
        title: isEditing ? "¡Actualizado!" : "¡Creado!",
        text: isEditing
          ? "Administrador actualizado con éxito"
          : "Administrador creado con éxito",
        confirmButtonColor: "#10b981",
        timer: 2000,
        timerProgressBar: true,
      });
      // Refetch admins
      const response = await adminApiClient.getAdmins();
      setAdmins(response.data || []);
    } catch (error) {
      console.error("Error con administrador:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo procesar la solicitud",
        confirmButtonColor: "#ef4444",
      });
    }
    setIsAddingAdmin(false);
    setAdminStep(1);
    setAdminType(null);
    setAdminData(null);
    setIsEditing(false);
    setSelectedAdmin(null);
    setEditingAdminId(null);
  };

  const renderContent = () => {
    // Show client creation form when creating a client (from any tab)
    if (isCreatingClient) {
      return (
        <CreateClientForm
          onBack={handleCancelClientCreation}
          onSubmit={handleClientFormSubmit}
          initialData={clientFormData || undefined}
        />
      );
    }

    if (
      user.role === "BRANCH_ADMIN" &&
      (activeTab === "Crear administradores" || activeTab === "Administradores")
    ) {
      return (
        <PlaceholderContainer>
          <h3>No tienes acceso a este módulo</h3>
        </PlaceholderContainer>
      );
    }

    if (activeTab === "Dashboard") {
      return (
        <>
          <SectionContainer>
            <SectionHeader>
              <SectionTitle>Últimas Reservas</SectionTitle>
              {!isBranchAdmin && (
                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {isSuperAdmin && (
                    <DateFilter
                      value={selectedEmpresaId ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        const nextEmpresaId = value ? Number(value) : null;
                        setSelectedEmpresaId(nextEmpresaId);
                        setSelectedSedeId(null);
                      }}
                    >
                      <option value="">Selecciona empresa</option>
                      {companies.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nombre}
                        </option>
                      ))}
                    </DateFilter>
                  )}

                  {(isSuperAdmin || isCompanyAdmin) && (
                    <DateFilter
                      value={selectedSedeId ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedSedeId(value ? Number(value) : null);
                      }}
                      disabled={!selectedEmpresaId}
                    >
                      <option value="">
                        {selectedEmpresaId
                          ? "Selecciona sede"
                          : "Selecciona empresa primero"}
                      </option>
                      {sedesByEmpresa.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.nombre}
                        </option>
                      ))}
                    </DateFilter>
                  )}
                </div>
              )}
              <DateFilter defaultValue="Agosto">
                <option value="Agosto">Agosto</option>
                <option value="Septiembre">Septiembre</option>
              </DateFilter>
            </SectionHeader>
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <Th>Servicio</Th>
                    <Th>Cliente</Th>
                    <Th>Fecha- Hora</Th>
                    <Th>Duración</Th>
                    <Th>Estado</Th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingAppointments ? (
                    <Tr>
                      <Td
                        colSpan={5}
                        style={{ textAlign: "center", color: "#6b7280" }}
                      >
                        Cargando reservas...
                      </Td>
                    </Tr>
                  ) : latestAppointments.length > 0 ? (
                    latestAppointments.map((appointment) => (
                      <Tr key={appointment.id}>
                        <Td>Servicio #{appointment.serviceId}</Td>
                        <Td>
                          <ClientName>{appointment.user.email}</ClientName>
                        </Td>
                        <Td>
                          {new Date(appointment.horaInicio).toLocaleDateString(
                            "es-ES",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            },
                          )}{" "}
                          -{" "}
                          {new Date(appointment.horaInicio).toLocaleTimeString(
                            "es-ES",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </Td>
                        <Td>
                          <PriceText>{appointment.duracion} min</PriceText>
                        </Td>
                        <Td>
                          <StatusBadge
                            status={
                              appointment.estado === "PENDING"
                                ? "Pendiente"
                                : appointment.estado === "COMPLETED"
                                  ? "Atendida"
                                  : appointment.estado === "CANCELLED"
                                    ? "Cancelado"
                                    : appointment.estado
                            }
                          />
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td
                        colSpan={5}
                        style={{ textAlign: "center", color: "#6b7280" }}
                      >
                        No hay reservas recientes
                      </Td>
                    </Tr>
                  )}
                </tbody>
              </Table>
            </TableWrapper>
          </SectionContainer>
          <BottomGrid>
            <DayReservations
              onAddReservation={() => setActiveTab("Reservas")}
            />
            <CalendarWidget />
          </BottomGrid>
        </>
      );
    }

    if (activeTab === "Reservas") {
      if (isAddingReservation) {
        return (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <SubTitle style={{ marginBottom: 0 }}>Agregar reserva</SubTitle>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  fontSize: "0.9rem",
                }}
              >
                <span style={{ color: "#6b7280" }}>Cliente:</span>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  {/* Search input - always visible */}
                  <div style={{ position: "relative" }}>
                    <input
                      ref={clientSearchInputRef}
                      type="text"
                      placeholder={
                        isSearchingQuickClient
                          ? "Buscando..."
                          : "Buscar por email o documento"
                      }
                      style={{
                        padding: "0.5rem 0.75rem",
                        borderRadius: "8px",
                        border: selectedUser
                          ? "1px solid #10B981"
                          : "1px solid #E5E7EB",
                        minWidth: "220px",
                        fontSize: "0.9rem",
                        opacity:
                          isSearchingQuickClient || selectedUser ? 0.7 : 1,
                        backgroundColor: selectedUser ? "#D1FAE5" : "white",
                      }}
                      value={
                        selectedUser ? selectedUser.email : quickClientSearch
                      }
                      onChange={(e) => {
                        setQuickClientSearch(e.target.value);
                        setClientNotFound(false);
                      }}
                      disabled={isSearchingQuickClient || !!selectedUser}
                    />
                    {isSearchingQuickClient && (
                      <div
                        style={{
                          position: "absolute",
                          right: "8px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          fontSize: "0.8rem",
                          color: "#6b7280",
                        }}
                      >
                        🔍
                      </div>
                    )}
                    {selectedUser && (
                      <div
                        style={{
                          position: "absolute",
                          right: "8px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          fontSize: "0.8rem",
                          color: "#10B981",
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </div>

                  {/* Client not found message */}
                  {clientNotFound && !selectedUser && (
                    <div
                      style={{
                        backgroundColor: "#FEE2E2",
                        border: "1px solid #EF4444",
                        borderRadius: "8px",
                        padding: "0.75rem",
                        fontSize: "0.85rem",
                        color: "#991B1B",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <span style={{ fontSize: "1rem" }}>⚠️</span>
                        <span>
                          <strong>Cliente no encontrado</strong> con el email:{" "}
                          <em>{quickClientSearch}</em>
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          marginLeft: "1.5rem",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            handleCreateUser(quickClientSearch.trim(), "email");
                            setClientNotFound(false);
                          }}
                          style={{
                            padding: "0.35rem 0.75rem",
                            borderRadius: "6px",
                            border: "none",
                            backgroundColor: "#EF4444",
                            color: "white",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            fontWeight: 500,
                          }}
                        >
                          Crear cliente
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setClientNotFound(false);
                            setQuickClientSearch("");
                          }}
                          style={{
                            padding: "0.35rem 0.75rem",
                            borderRadius: "6px",
                            border: "1px solid #991B1B",
                            backgroundColor: "transparent",
                            color: "#991B1B",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                          }}
                        >
                          Buscar otro
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {/* Search button - always visible */}
                <button
                  type="button"
                  style={{
                    padding: "0.55rem 1.2rem",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: selectedUser ? "#EF4444" : "#10B981",
                    color: "white",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    whiteSpace: "nowrap",
                  }}
                  onClick={async () => {
                    if (selectedUser) {
                      // Si ya hay usuario, el botón actúa para deseleccionar/limpiar
                      setSelectedUser(null);
                      localStorage.removeItem("selectedUser");
                      setQuickClientSearch("");
                      return;
                    }

                    if (!quickClientSearch.trim()) {
                      setActiveTab("Clientes");
                      setIsAddingReservation(false);
                      return;
                    }

                    try {
                      setIsSearchingQuickClient(true);
                      const response =
                        await clientApiClient.searchClientByEmail(
                          quickClientSearch.trim(),
                        );

                      if (response.data && response.data.userData) {
                        const found = response.data;
                        const userData = {
                          id: String(found.id),
                          name: found.userData.name || "Sin nombre",
                          email: found.email,
                          phone: found.userData.phone || "",
                          document: undefined,
                        };
                        setSelectedUser(userData);
                        localStorage.setItem(
                          "selectedUser",
                          JSON.stringify(userData),
                        );
                        setQuickClientSearch("");
                      } else {
                        setClientNotFound(true);
                      }
                    } catch (error) {
                      console.error("Error buscando cliente rápido:", error);
                      const err = error as {
                        response?: { status: number };
                        status?: number;
                      };
                      if (
                        err?.response?.status === 404 ||
                        err?.status === 404
                      ) {
                        setClientNotFound(true);
                      } else {
                        alert("Error en la búsqueda del cliente");
                      }
                    } finally {
                      setIsSearchingQuickClient(false);
                    }
                  }}
                >
                  {selectedUser
                    ? "Cambiar cliente"
                    : "Buscar / registrar cliente"}
                </button>
              </div>
            </div>

            {bookingStep === 1 && (
              <AddReservationServices
                onBack={() => setIsAddingReservation(false)}
                onNext={handleServiceSelected}
                selectedUser={selectedUser}
                sedeId={effectiveSedeId}
                userRole={userRole}
              />
            )}

            {bookingStep === 2 && (
              <div style={{ marginTop: "1rem" }}>
                <AddReservationCalendar
                  onBack={() => setBookingStep(1)}
                  onNext={handleDateSelected}
                  selectedUser={selectedUser}
                  onClearUser={() => {
                    setSelectedUser(null);
                    localStorage.removeItem("selectedUser");
                    setQuickClientSearch("");
                    setClientNotFound(false);
                  }}
                />
              </div>
            )}

            {bookingStep === 3 && bookingDetails.date && (
              <AddReservationTime
                selectedDate={bookingDetails.date}
                onBack={() => setBookingStep(2)}
                onNext={handleTimeSelected}
                serviceName={bookingDetails.serviceName}
                clientName={selectedUser?.name || "Cliente no identificado"}
                price={bookingDetails.price}
              />
            )}

            {bookingStep === 4 && (
              <AddReservationConfirm
                bookingData={bookingDetails}
                onBack={() => setBookingStep(3)}
                onConfirm={handleFinalSubmit}
                user={selectedUser}
              />
            )}
          </>
        );
      }

      return (
        <>
          <SubTitle>Listado de reservas</SubTitle>
          <FilterBar>
            <FilterGroup>
              <FilterIconContainer>
                <img src={filterIcon} alt="Filtro" width={20} />
              </FilterIconContainer>
              <FilterLabel>Filtrar por</FilterLabel>
              <FilterTrigger
                onClick={() => {
                  setIsCalendarOpen(!isCalendarOpen);
                  setIsServicesOpen(false);
                }}
              >
                <span>{formatDate(selectedDate)}</span>
                <img src={chevronDownIcon} alt="v" width={10} />
                {isCalendarOpen && (
                  <DatePicker
                    selectedDate={selectedDate}
                    onSelect={setSelectedDate}
                    onClose={() => setIsCalendarOpen(false)}
                  />
                )}
              </FilterTrigger>
              <FilterTrigger
                onClick={() => {
                  setIsServicesOpen(!isServicesOpen);
                  setIsTimeOpen(false);
                }}
              >
                <span>{selectedService.name}</span>
                <img src={chevronDownIcon} alt="v" width={10} />
                {isServicesOpen && (
                  <CustomDropdown
                    title="Selecciona la categoria"
                    options={
                      servicesList.length > 0
                        ? servicesList.map((s) => s.name)
                        : ["Cargando..."]
                    }
                    onSelect={(name) => {
                      const service = servicesList.find((s) => s.name === name);
                      setSelectedService({
                        id: service?.id || null,
                        name: name,
                      });
                    }}
                    onClose={() => setIsServicesOpen(false)}
                    enableSearch
                  />
                )}
              </FilterTrigger>
              <FilterTrigger
                onClick={() => {
                  setIsTimeOpen(!isTimeOpen);
                  setIsServicesOpen(false);
                }}
              >
                <span>{selectedTime}</span>
                <img src={chevronDownIcon} alt="v" width={10} />
                {isTimeOpen && (
                  <CustomDropdown
                    title="Selecciona la hora"
                    options={[
                      "08:00am",
                      "08:30am",
                      "09:00am",
                      "09:30am",
                      "10:00am",
                      "10:30am",
                      "11:00am",
                      "11:30am",
                      "12:00pm",
                      "12:30pm",
                      "01:00pm",
                      "01:30pm",
                      "02:00pm",
                      "02:30pm",
                      "03:00pm",
                      "03:30pm",
                      "04:00pm",
                      "04:30pm",
                      "05:00pm",
                      "05:30pm",
                      "06:00pm",
                    ]}
                    onSelect={setSelectedTime}
                    onClose={() => setIsTimeOpen(false)}
                  />
                )}
              </FilterTrigger>
              <ResetButton
                onClick={() => {
                  setSelectedDate(new Date());
                  setSelectedService({ id: null, name: "Servicio" });
                  setSelectedTime("Hora");
                }}
              >
                <img src={refreshIcon} alt="Reset" />
                Reset
              </ResetButton>
            </FilterGroup>
            <AddReservationBtn onClick={handleStartBooking}>
              + Agregar reserva
            </AddReservationBtn>
          </FilterBar>

          <SectionContainer>
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <Th>ID</Th>
                    <Th>Nombre</Th>
                    <Th>Servicio</Th>
                    <Th>Hora</Th>
                    <Th>Fecha</Th>
                    <Th>Estado serv.</Th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingFilteredAppointments ? (
                    <Tr>
                      <Td
                        colSpan={6}
                        style={{ textAlign: "center", color: "#6b7280" }}
                      >
                        Cargando reservas...
                      </Td>
                    </Tr>
                  ) : filteredAppointments.length > 0 ? (
                    filteredAppointments.map((row) => (
                      <Tr key={row.id}>
                        <Td>{row.id}</Td>
                        <Td>
                          <ClientName>{row.user.email}</ClientName>
                        </Td>
                        <Td>
                          <ServiceColumn>
                            <span>Servicio #{row.serviceId}</span>
                            <SpecialistText>
                              Profesional: {row.profesional.nombre}
                            </SpecialistText>
                          </ServiceColumn>
                        </Td>
                        <Td>
                          {new Date(row.horaInicio).toLocaleTimeString(
                            "es-ES",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </Td>
                        <Td>
                          {new Date(row.fecha).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </Td>
                        <Td>
                          <StatusCell>
                            <StatusBadge
                              status={
                                row.estado === "PENDING"
                                  ? "Pendiente"
                                  : row.estado === "COMPLETED"
                                    ? "Atendida"
                                    : row.estado === "CANCELLED"
                                      ? "Cancelado"
                                      : row.estado
                              }
                            />
                            {row.estado === "PENDING" && (
                              <DeleteButton
                                onClick={() => {
                                  setAppointmentToCancel(row);
                                  setCancelModalOpen(true);
                                }}
                              >
                                <img src={closeIcon} alt="Eliminar" />
                              </DeleteButton>
                            )}
                          </StatusCell>
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td
                        colSpan={6}
                        style={{ textAlign: "center", color: "#6b7280" }}
                      >
                        No hay reservas para los filtros seleccionados
                      </Td>
                    </Tr>
                  )}
                </tbody>
              </Table>
            </TableWrapper>
          </SectionContainer>
          {cancelModalOpen && appointmentToCancel && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 200,
              }}
              onClick={() => {
                if (!isCancellingAppointment) {
                  setCancelModalOpen(false);
                  setAppointmentToCancel(null);
                }
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  backgroundColor: "white",
                  borderRadius: 12,
                  padding: "1.5rem 1.75rem",
                  maxWidth: 420,
                  width: "90%",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                }}
              >
                <h3 style={{ marginTop: 0, marginBottom: "0.75rem" }}>
                  Cancelar cita
                </h3>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#4b5563",
                    lineHeight: 1.5,
                    marginBottom: "1.25rem",
                  }}
                >
                  Vas a cancelar la cita del servicio #{" "}
                  {appointmentToCancel.serviceId} para{" "}
                  <strong>{appointmentToCancel.user.email}</strong> el{" "}
                  {new Date(appointmentToCancel.fecha).toLocaleDateString(
                    "es-ES",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    },
                  )}{" "}
                  a las{" "}
                  {new Date(appointmentToCancel.horaInicio).toLocaleTimeString(
                    "es-ES",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                  .
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "0.75rem",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (isCancellingAppointment) return;
                      setCancelModalOpen(false);
                      setAppointmentToCancel(null);
                    }}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: 8,
                      border: "1px solid #d1d5db",
                      backgroundColor: "white",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                    }}
                  >
                    Cerrar
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!appointmentToCancel) return;
                      try {
                        setIsCancellingAppointment(true);
                        await appointmentsApiClient.cancelAppointment(
                          appointmentToCancel.id,
                        );

                        setFilteredAppointments((prev) =>
                          prev.map((a) =>
                            a.id === appointmentToCancel.id
                              ? { ...a, estado: "CANCELLED" }
                              : a,
                          ),
                        );

                        setCancelModalOpen(false);
                        setAppointmentToCancel(null);
                      } catch (error) {
                        console.error("Error cancelling appointment:", error);
                      } finally {
                        setIsCancellingAppointment(false);
                      }
                    }}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: 8,
                      border: "none",
                      backgroundColor: "#EF4444",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                    }}
                    disabled={isCancellingAppointment}
                  >
                    {isCancellingAppointment
                      ? "Cancelando..."
                      : "Cancelar cita"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      );
    }

    if (activeTab === "Crear administradores") {
      if (isAddingAdmin) {
        return (
          <>
            <SubTitle>
              {isEditing ? "Editar administrador" : "Agregar administrador"}
            </SubTitle>

            {adminStep === 1 && (
              <AddAdminType
                onBack={() => setIsAddingAdmin(false)}
                onNext={handleAdminTypeSelected}
              />
            )}

            {adminStep === 2 && adminType && (
              <AddAdminForm
                type={adminType}
                onBack={() => setAdminStep(1)}
                onNext={handleAdminFormSubmitted}
                isEditing={isEditing}
                initialData={adminData ?? undefined}
              />
            )}

            {adminStep === 3 && adminData && adminType && (
              <AddAdminConfirm
                type={adminType}
                data={adminData}
                onBack={() => setAdminStep(2)}
                onConfirm={handleAdminConfirm}
                isEditing={isEditing}
                companies={companies}
              />
            )}
          </>
        );
      }

      return (
        <>
          <FilterBar>
            <FilterGroup>{/* Add filters if needed */}</FilterGroup>
            <AddReservationBtn onClick={handleStartAddingAdmin}>
              + Agregar administrador
            </AddReservationBtn>
          </FilterBar>

          <SectionContainer>
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <Th>ID</Th> <Th>Nombre</Th> <Th>Email</Th> <Th>Rol</Th>{" "}
                    <Th>Estado</Th> <Th>Acciones</Th>
                  </tr>
                </thead>
                <tbody>
                  {admins.length > 0 ? (
                    admins.map((admin) => (
                      <Tr key={admin.id}>
                        <Td>{admin.id}</Td>
                        <Td>
                          <ClientName>
                            {admin.AdminProfile.firstName}{" "}
                            {admin.AdminProfile.lastName}
                          </ClientName>
                        </Td>
                        <Td>{admin.email}</Td>
                        <Td>
                          {admin.role === "BRANCH_ADMIN"
                            ? "Administrador Sede"
                            : admin.role === "COMPANY_ADMIN"
                              ? "Administrador Compañía"
                              : admin.role}
                        </Td>
                        <Td>
                          <StatusBadge status={admin.state} />
                        </Td>
                        <Td>
                          <EditButton onClick={() => handleEdit(admin)}>
                            Editar
                          </EditButton>
                          <DeleteAdminButton
                            type="button"
                            onClick={() => handleDeleteAdmin(admin.id)}
                          >
                            Eliminar
                          </DeleteAdminButton>
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td
                        colSpan={6}
                        style={{ textAlign: "center", color: "#6b7280" }}
                      >
                        No hay administradores registrados aún
                      </Td>
                    </Tr>
                  )}
                </tbody>
              </Table>
            </TableWrapper>
          </SectionContainer>
        </>
      );
    }

    if (activeTab === "Administradores") {
      return (
        <AdminList
          admins={admins}
          onEdit={handleEdit}
          onDelete={handleDeleteAdmin}
        />
      );
    }

    if (activeTab === "Empresas") {
      return <EmpresasModule />;
    }

    if (activeTab === "Clientes") {
      return (
        <>
          <SubTitle>Gestión de Clientes</SubTitle>
          <FilterBar>
            <FilterGroup>{/* Add filters if needed */}</FilterGroup>
            <AddReservationBtn onClick={handleStartCreatingClient}>
              + Crear cliente
            </AddReservationBtn>
          </FilterBar>

          <SectionContainer>
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <Th>ID</Th>
                    <Th>Nombre</Th>
                    <Th>Email</Th>
                    <Th>Teléfono</Th>
                    <Th>Documento</Th>
                    <Th>Estado</Th>
                    <Th>Acciones</Th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingClients ? (
                    <Tr>
                      <Td
                        colSpan={7}
                        style={{ textAlign: "center", color: "#6b7280" }}
                      >
                        Cargando clientes...
                      </Td>
                    </Tr>
                  ) : clients.length > 0 ? (
                    clients.map((client) => (
                      <Tr key={client.id}>
                        <Td>{client.id}</Td>
                        <Td>
                          <ClientName>{client.name}</ClientName>
                        </Td>
                        <Td>{client.email}</Td>
                        <Td>{client.phone || "No registrado"}</Td>
                        <Td>{client.document || "No registrado"}</Td>
                        <Td>
                          <StatusBadge status={client.state} />
                        </Td>
                        <Td>
                          <button
                            onClick={() =>
                              alert(`Editar cliente ${client.name}`)
                            }
                          >
                            Editar
                          </button>
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td
                        colSpan={7}
                        style={{ textAlign: "center", color: "#6b7280" }}
                      >
                        No hay clientes registrados aún. Los clientes se pueden
                        crear durante el proceso de reserva.
                      </Td>
                    </Tr>
                  )}
                </tbody>
              </Table>
            </TableWrapper>
          </SectionContainer>
        </>
      );
    }

    return (
      <PlaceholderContainer>
        <h3>Próximamente: Módulo de {activeTab}</h3>
      </PlaceholderContainer>
    );
  };

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={(tab) => {
        setActiveTab(tab);
        setIsAddingReservation(false);
        setIsAddingAdmin(false);
        setIsCreatingClient(false);
      }}
    >
      <PageHeader>
        <PageTitle>{activeTab}</PageTitle>
        <SedeButton>{sedeName}</SedeButton>
      </PageHeader>
      {renderContent()}
    </DashboardLayout>
  );
}
