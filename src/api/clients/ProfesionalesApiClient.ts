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
}
