import type { HttpClient } from "../http/HttpClient";

export interface Appointment {
  id: number;
  fecha: string;
  createdAt: string;
  updatedAt: string;
  sedeId: number;
  serviceId: number;
  profesionalId: number;
  duracion: number;
  estado: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  horaFin: string;
  horaInicio: string;
  notas: string;
  userId: number;
  sede: {
    id: number;
    nombre: string;
    direccion: string;
    telefono: string;
    latitud: number;
    longitud: number;
    provincia: string;
    horario: Record<string, string>;
    diasCerrado: string[];
    imagenes: string[];
    createdAt: string;
    updatedAt: string;
    empresaId: number;
  };
  service: {
    id: number;
    createdAt: string;
    updatedAt: string;
    categoryId: number;
    imagenes: string[];
  };
  profesional: {
    id: number;
    nombre: string;
    biografia: string;
    imagen: string;
    phone: string;
    state: string;
    createdAt: string;
    updatedAt: string;
    sedeId: number;
  };
  user: {
    id: number;
    email: string;
    clientType: string;
    state: string;
    acceptTerms: boolean;
    acceptPolitics: boolean;
    createdAt: string;
    updatedAt: string;
    fotoPerfil: string | null;
    role: string;
  };
}

export class AppointmentsApiClient {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  getLatestAppointments(branchId: number, limit: number = 5) {
    return this.httpClient.get<Appointment[]>(
      `/appointments/branches/${branchId}/latest?limit=${limit}`
    );
  }

  getFilteredAppointments(params: {
    sedeId?: number;
    date?: string; // YYYY-MM-DD
    startDate?: string; // YYYY-MM-DD
    endDate?: string; // YYYY-MM-DD
    serviceId?: number;
    hour?: string; // HH:mm
    page?: number;
    limit?: number;
  }) {
    const query = new URLSearchParams();

    if (params.sedeId) query.append("sedeId", String(params.sedeId));
    if (params.date) query.append("date", params.date);
    if (params.startDate) query.append("startDate", params.startDate);
    if (params.endDate) query.append("endDate", params.endDate);
    if (params.serviceId) query.append("serviceId", String(params.serviceId));
    if (params.hour) query.append("hour", params.hour);
    if (params.page) query.append("page", String(params.page));
    if (params.limit) query.append("limit", String(params.limit));

    const queryString = query.toString();
    const url = queryString
      ? `/appointments/filter?${queryString}`
      : "/appointments/filter";

    return this.httpClient.get<{
      items: Appointment[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
      fallbackApplied: boolean;
    }>(url);
  }

  cancelAppointment(id: number) {
    return this.httpClient.patch<Appointment>(
      `/appointments/${id}/cancel`,
      {},
    );
  }
}
