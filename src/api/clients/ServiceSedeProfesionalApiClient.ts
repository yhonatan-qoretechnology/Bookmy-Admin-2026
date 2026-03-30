import type { HttpClient } from "../http/HttpClient";

export interface ServiceSedeProfesionalPrecio {
  id: number;
  amount: number;
  duration: number;
  currency: string;
}

export interface ServiceSedeProfesionalItem {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  precios: ServiceSedeProfesionalPrecio[];
  asignado: boolean;
  serviceSedeProfesionalId?: number;
}

export interface CreateServiceSedeProfesionalRequest {
  serviceId: number;
  sedeId: number;
  profesionalId: number;
}

export interface CreateServiceSedeProfesionalResponse {
  id: number;
}

export interface ServiceSedeProfesionalRelation {
  id: number;
  sedeId: number;
  serviceId: number;
  profesionalId: number;
}

export class ServiceSedeProfesionalApiClient {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  getAllRelations() {
    return this.httpClient.get<ServiceSedeProfesionalRelation[]>(
      `/service-sede-profesional`,
    );
  }

  getServiciosBySedeAndProfesional(
    sedeId: number,
    profesionalId: number,
    language: string = "es",
  ) {
    return this.httpClient.get<ServiceSedeProfesionalItem[]>(
      `/service-sede-profesional/by-sede/${sedeId}/by-profesional/${profesionalId}`,
      {
        queryParams: { language },
      },
    );
  }

  assignServicioToProfesional(body: CreateServiceSedeProfesionalRequest) {
    return this.httpClient.post<CreateServiceSedeProfesionalResponse, CreateServiceSedeProfesionalRequest>(
      `/service-sede-profesional`,
      body,
    );
  }

  unassignServicioFromProfesional(serviceSedeProfesionalId: number) {
    return this.httpClient.delete<void>(
      `/service-sede-profesional/${serviceSedeProfesionalId}`,
    );
  }
}
