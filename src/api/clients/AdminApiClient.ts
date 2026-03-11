import type { HttpClient } from '../http/HttpClient';
import type { CreateAdminRequest, AdminResponse, Admin } from '../../core/domain/admin/AdminTypes';

export class AdminApiClient {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  createCompanyAdmin(companyId: number, data: CreateAdminRequest) {
    return this.httpClient.post<AdminResponse, CreateAdminRequest>(
      `/admin/companies/${companyId}/admins`,
      data,
    );
  }

  createBranchAdmin(branchId: number, data: CreateAdminRequest) {
    return this.httpClient.post<AdminResponse, CreateAdminRequest>(
      `/admin/branches/${branchId}/admins`,
      data,
    );
  }

  getAdmins() {
    const env: any = (import.meta as any).env || {};
    const apiBase: string = env.VITE_API_BASE_URL || "http://localhost:3000";

    return this.httpClient.get<Admin[]>(
      `${apiBase.replace(/\/$/, "")}/admin/admins`,
    );
  }

  async updateAdmin(adminId: number, data: CreateAdminRequest): Promise<AdminResponse> {
    const env: any = (import.meta as any).env || {};
    const apiBase: string = env.VITE_API_BASE_URL || "http://localhost:3000";
    const url = `${apiBase.replace(/\/$/, "")}/admin/admins/${adminId}`;
    const response = await this.httpClient.patch(url, data);
    return response.data;
  }

  async getAdminById(adminId: number): Promise<Admin> {
    const env: any = (import.meta as any).env || {};
    const apiBase: string = env.VITE_API_BASE_URL || "http://localhost:3000";
    const url = `${apiBase.replace(/\/$/, "")}/admin/admins/${adminId}`;
    const response = await this.httpClient.get(url);
    return response.data;
  }
}
