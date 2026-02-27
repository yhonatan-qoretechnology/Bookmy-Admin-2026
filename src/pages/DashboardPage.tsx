import { useState, useEffect } from "react";
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
import { AddReservationUserSearch } from "../components/dashboard/AddReservationUserSearch";
import {
  CreateClientForm,
  type ClientFormData,
} from "../components/dashboard/CreateClientForm";
import { AddAdminType } from "../components/dashboard/AddAdminType";
import { AddAdminForm } from "../components/dashboard/AddAdminForm";
import { AddAdminConfirm } from "../components/dashboard/AddAdminConfirm";
import { AdminList } from "../components/dashboard/AdminList";
import { useAuthGuard } from "../presentation/hooks/useAuthGuard";

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
import { SedesApiClient } from "../api/clients/SedesApiClient";
import { TimeSlotsApiClient } from "../api/clients/TimeSlotsApiClient";
import type { AdminFormData, Admin } from "../core/domain/admin/AdminTypes";
import type { Client } from "../core/domain/client/ClientTypes";
import type { Appointment } from "../api/clients/AppointmentsApiClient";
import type { Category } from "../api/clients/ServicesApiClient";

const httpClient = new FetchHttpClient();
const sedesApiClient = new SedesApiClient(httpClient);
const adminApiClient = new AdminApiClient(httpClient);
const clientApiClient = new ClientApiClient(httpClient);
const appointmentsApiClient = new AppointmentsApiClient(httpClient);
const servicesApiClient = new ServicesApiClient(httpClient);
const timeSlotsApiClient = new TimeSlotsApiClient(httpClient);

const SERVICES_LIST: string[] = [];

const LISTADO_RESERVAS = [
  {
    id: 1,
    nombre: "Andrea Reyes",
    servicio: "Manicura Semipermanente",
    especialista: "Nayomi",
    hora: "11:00 AM",
    fecha: "Hoy",
    estado: "Pendiente",
  },
  {
    id: 2,
    nombre: "María García",
    servicio: "Pedicura Spa",
    especialista: "Sofía",
    hora: "2:30 PM",
    fecha: "Hoy",
    estado: "Atendida",
  },
  {
    id: 3,
    nombre: "Lucía Fernández",
    servicio: "Uñas Acrílicas",
    especialista: "Valentina",
    hora: "4:00 PM",
    fecha: "Hoy",
    estado: "Cancelado",
  },
];

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
const FilterSelect = styled.select`
  padding: 0.6rem 1rem;
  border: 1px solid #f0f0f0;
  background-color: #f9fafb;
  border-radius: 8px;
  color: ${({ theme }) => theme.text};
  font-weight: 600;
  outline: none;
  min-width: 140px;
  cursor: pointer;
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
  const branchId = user?.AdminProfile?.sedeId;

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

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("Servicio");
  const [servicesList, setServicesList] = useState<string[]>([]);

  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState("Hora");

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

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
  }, []);

  // Load filtered appointments for "Listado de reservas"
  useEffect(() => {
    const fetchFilteredAppointments = async () => {
      try {
        setIsLoadingFilteredAppointments(true);

        const params: {
          sedeId?: number;
          startDate?: string;
          endDate?: string;
          page?: number;
          limit?: number;
        } = {};

        if (branchId) {
          params.sedeId = branchId;
        }

        // Por defecto, cargar todo el mes actual
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        params.startDate = startOfMonth.toISOString().split("T")[0];
        params.endDate = endOfMonth.toISOString().split("T")[0];

        console.log("Parámetros enviados a /appointments/filter:", params);

        params.page = 1;
        params.limit = 200; // Aumentado para cargar todo el mes

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
  }, [branchId]);

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
        if (!branchId) {
          setLatestAppointments([]);
          return;
        }

        const response = await appointmentsApiClient.getLatestAppointments(
          branchId,
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
  }, [branchId]);

  // Load services/categories from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await servicesApiClient.getCategories();
        const categories = response.data || [];
        // Map category names to servicesList
        setServicesList(
          categories.map(
            (cat: Category) => cat.translations[0]?.name || "Sin nombre",
          ),
        );
      } catch (error) {
        console.error("Error loading services:", error);
        setServicesList([]);
      }
    };
    fetchServices();
  }, []);

  // Load time slots
  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const response = await timeSlotsApiClient.getTimeSlots();
        setTimeSlots(response.data || []);
      } catch (error) {
        console.error("Error loading time slots:", error);
        setTimeSlots([]);
      }
    };
    fetchTimeSlots();
  }, []);

  // Load sede name based on user's sedeId
  useEffect(() => {
    const fetchSedeName = async () => {
      try {
        // Get sedeId from user session (AdminProfile.sedeId)
        const sedeId = user?.AdminProfile?.sedeId;
        const empresaId = user?.AdminProfile?.empresaId;

        if (!sedeId || !empresaId) {
          setSedeName("Sede no asignada");
          return;
        }

        // Fetch all sedes for this empresa and find the matching one
        const response = await sedesApiClient.getSedesByEmpresaId(empresaId);
        const sedes = response.data || [];
        const userSede = sedes.find((sede) => sede.id === sedeId);

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
  }, [user]);

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
    if (!selectedUser) {
      alert("Por favor selecciona un cliente antes de continuar");
      return;
    }
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
      sedeId: branchId,
    };

    console.log("RESERVA CREADA (PAYLOAD FINAL):", payload);

    alert("Reserva creada con éxito");
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
      document: searchType === "document" ? searchValue : "",
      password: "",
      gender: "Masculino",
      birthdate: "1990-01-15",
      firstName: "",
      lastName: "",
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
      formData.append("document", data.document);
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
      formData.append("categoryIds", "1,5,10"); // Categorías por defecto
      formData.append("fotoPerfil", "");

      const response = await clientApiClient.registerClient(formData);
      const newUser = response.data.user;

      // Create a Client object from the user response
      const newClient: Client = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.UserData.name,
        phone: newUser.UserData.phone,
        document: data.document, // Keep document from form since API doesn't return it
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

  const handleEdit = (admin: Admin) => {
    setIsEditing(true);
    setSelectedAdmin(admin);
    setAdminType(admin.role === "COMPANY_ADMIN" ? "company" : "branch");
    setAdminData({
      email: admin.email,
      password: "",
      phone: admin.AdminProfile.phone,
      firstName: admin.AdminProfile.firstName,
      lastName: admin.AdminProfile.lastName,
      name: admin.UserData.name,
      countryId: admin.UserData.countryId,
      idioma: admin.UserData.idioma,
      gender: admin.UserData.gender,
      birthdate: admin.UserData.birthdate.split("T")[0],
      empresaId: admin.AdminProfile.empresaId,
      sedeId: admin.AdminProfile.sedeId || undefined,
      clientType: admin.clientType,
      state: admin.state,
      role: admin.role,
    });
    setAdminStep(2);
    setIsAddingAdmin(true);
    setActiveTab("Crear administradores");
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
      if (adminType === "company") {
        await adminApiClient.createCompanyAdmin(adminData.empresaId, adminData);
      } else if (adminType === "branch") {
        await adminApiClient.createBranchAdmin(adminData.sedeId, adminData);
      }
      alert(
        isEditing
          ? "Administrador actualizado con éxito"
          : "Administrador creado con éxito",
      );
      // Refetch admins
      const response = await adminApiClient.getAdmins();
      setAdmins(response.data || []);
    } catch (error) {
      console.error("Error creando administrador:", error);
      alert("Error creando administrador");
    }
    setIsAddingAdmin(false);
    setAdminStep(1);
    setAdminType(null);
    setAdminData(null);
    setIsEditing(false);
    setSelectedAdmin(null);
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
                        setSelectedUser({
                          id: String(found.id),
                          name: found.userData.name || "Sin nombre",
                          email: found.email,
                          phone: found.userData.phone || "",
                          document: undefined,
                        });
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
                <span>{selectedService}</span>
                <img src={chevronDownIcon} alt="v" width={10} />
                {isServicesOpen && (
                  <CustomDropdown
                    title="Selecciona la categoria"
                    options={
                      servicesList.length > 0 ? servicesList : ["Cargando..."]
                    }
                    onSelect={setSelectedService}
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
                    title="Selecciona el rango de hora"
                    options={timeSlots.length > 0 ? timeSlots : ["Cargando..."]}
                    onSelect={setSelectedTime}
                    onClose={() => setIsTimeOpen(false)}
                  />
                )}
              </FilterTrigger>
              <ResetButton
                onClick={() => {
                  setSelectedDate(new Date());
                  setSelectedService("Servicio");
                  setSelectedTime("Hora");
                }}
              >
                <img src={refreshIcon} alt="Reset" /> Reset
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
              />
            )}

            {adminStep === 3 && adminData && adminType && (
              <AddAdminConfirm
                type={adminType}
                data={adminData}
                onBack={() => setAdminStep(2)}
                onConfirm={handleAdminConfirm}
                isEditing={isEditing}
              />
            )}
          </>
        );
      }

      return (
        <>
          <SubTitle>Listado de administradores</SubTitle>
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
                        <Td>{admin.role}</Td>
                        <Td>
                          <StatusBadge status={admin.state} />
                        </Td>
                        <Td>
                          <button onClick={() => handleEdit(admin)}>
                            Editar
                          </button>
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
      return <AdminList onEdit={handleEdit} />;
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
        <PageTitle>{activeTab} - Glow Experiencie</PageTitle>
        <SedeButton>{sedeName}</SedeButton>
      </PageHeader>
      {renderContent()}
    </DashboardLayout>
  );
}
