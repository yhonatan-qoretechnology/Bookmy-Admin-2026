import type { HttpClient } from "../http/HttpClient";
import type {
  CreateEmpresaRequest,
  Empresa,
  UpdateEmpresaRequest,
} from "../../core/domain/empresa/EmpresaTypes";

export class EmpresasApiClient {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  getEmpresas() {
    return this.httpClient.get<Empresa[]>("/empresas");
  }

  getEmpresaById(empresaId: number) {
    return this.httpClient.get<Empresa>(`/empresas/${empresaId}`);
  }

  createEmpresa(data: CreateEmpresaRequest) {
    const formData = new FormData();
    formData.append("nombre", data.nombre);
    formData.append("telefono", data.telefono);
    formData.append("email", data.email);
    formData.append("nit", data.nit);
    formData.append("descripcion", data.descripcion);

    if (data.descripcionLarga) formData.append("descripcionLarga", data.descripcionLarga);
    if (data.facebookUrl) formData.append("facebookUrl", data.facebookUrl);
    if (data.instagramUrl) formData.append("instagramUrl", data.instagramUrl);
    if (data.tiktokUrl) formData.append("tiktokUrl", data.tiktokUrl);
    if (data.webUrl) formData.append("webUrl", data.webUrl);
    if (data.logo) formData.append("logo", data.logo);

    return this.httpClient.post<Empresa, FormData>("/empresas", formData);
  }

  updateEmpresa(empresaId: number, data: UpdateEmpresaRequest) {
    const formData = new FormData();

    if (data.nombre !== undefined && data.nombre !== "") formData.append("nombre", data.nombre);
    if (data.telefono !== undefined && data.telefono !== "") formData.append("telefono", data.telefono);
    if (data.email !== undefined && data.email !== "") formData.append("email", data.email);
    if (data.nit !== undefined && data.nit !== "") formData.append("nit", data.nit);
    if (data.descripcion !== undefined && data.descripcion !== "") formData.append("descripcion", data.descripcion);

    if (data.descripcionLarga !== undefined && data.descripcionLarga !== "")
      formData.append("descripcionLarga", data.descripcionLarga);
    if (data.facebookUrl !== undefined && data.facebookUrl !== "")
      formData.append("facebookUrl", data.facebookUrl);
    if (data.instagramUrl !== undefined && data.instagramUrl !== "")
      formData.append("instagramUrl", data.instagramUrl);
    if (data.tiktokUrl !== undefined && data.tiktokUrl !== "")
      formData.append("tiktokUrl", data.tiktokUrl);
    if (data.webUrl !== undefined && data.webUrl !== "")
      formData.append("webUrl", data.webUrl);

    if (data.logo) formData.append("logo", data.logo);

    return this.httpClient.patch<Empresa, FormData>(`/empresas/${empresaId}`, formData);
  }

  deleteEmpresa(empresaId: number) {
    return this.httpClient.delete<void>(`/empresas/${empresaId}`);
  }
}
