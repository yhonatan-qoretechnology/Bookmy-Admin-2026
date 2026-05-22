import type { HttpClient } from "../http/HttpClient";

export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  imagen: string;
  precios: {
    id: number;
    amount: number;
    duration: number;
    currency: string;
  }[];
}

export interface Profesional {
  id: number;
  nombre: string;
  biografia: string;
  imagen: string;
  telefono: string;
  state: string;
  sedeId: number;
  servicios: Servicio[];
}

export class ProfesionalesApiClient {
  constructor(private readonly httpClient: HttpClient) {}

  getProfesionalesBySede(sedeId: number, lang: string = "es") {
    return this.httpClient.get<Profesional[]>(`/profesionales/by-sede/${sedeId}`, {
      queryParams: { lang },
    });
  }

  getFutureServicesByProfesional(profesionalId: number, lang: string = "es") {
    return this.httpClient.get<Array<{
      appointmentId: number;
      fecha: string;
      horaInicio: string;
      horaFin: string;
      estado: string;
      service: {
        id: number;
        nombre: string;
        descripcion: string;
        categoria: string;
        precios: Array<{
          id: number;
          amount: number;
          duration: number;
          currency: string;
        }>;
      };
      sede: {
        id: number;
        nombre: string;
      };
      profesional: {
        id: number;
        nombre: string;
        telefono: string;
        imagen: string;
      };
      user: {
        id: number;
        email: string;
        nombre: string;
        telefono: string;
      };
      payment: {
        id: number;
        method: string;
        totalAmount: number;
        paidAmount: number;
        status: string;
      };
    }>>(`/profesionales/${profesionalId}/servicios-futuros`, {
      queryParams: { lang },
    });
  }

  createProfesional(formData: FormData) {
    return this.httpClient.post<Profesional, FormData>(
      `/profesionales`,
      formData,
    );
  }
}
