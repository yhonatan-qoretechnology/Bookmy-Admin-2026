import type { HttpClient } from "../http/HttpClient";

export interface Sede {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  latitud: number;
  longitud: number;
  provincia: string;
  horario: Record<string, string>;
  diasCerrado: string | null;
  imagenes: string[];
  createdAt: string;
  updatedAt: string;
  empresaId: number;
  Service: unknown[];
}

export class SedesApiClient {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  getSedesByEmpresaId(
    empresaId: number,
    options?: {
      withServices?: boolean;
    },
  ) {
    return this.httpClient.get<Sede[]>(`/sedes/empresa/${empresaId}`, {
      queryParams:
        options?.withServices === undefined
          ? undefined
          : { withServices: options.withServices },
    });
  }

  createSede(formData: FormData) {
    return this.httpClient.post<Sede, FormData>("/sedes", formData);
  }
}
