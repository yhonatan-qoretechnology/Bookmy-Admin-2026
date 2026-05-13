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

  getSedeById(sedeId: number) {
    return this.httpClient.get<Sede>(`/sedes/${sedeId}`);
  }

  createSede(formData: FormData) {
    return this.httpClient.post<Sede, FormData>("/sedes", formData);
  }

  updateSede(sedeId: number, formData: FormData) {
    return this.httpClient.patch<Sede, FormData>(`/sedes/${sedeId}`, formData);
  }

  deleteSedeImages(sedeId: number, imagenes: string[]) {
    return this.httpClient.delete<Sede>(`/sedes/${sedeId}/imagenes`, {
      imagenes,
    });
  }

  addSedeImage(sedeId: number, imagen: File) {
    const formData = new FormData();
    formData.append("imagen", imagen);
    return this.httpClient.post<Sede, FormData>(
      `/sedes/${sedeId}/imagen`,
      formData,
    );
  }
}
