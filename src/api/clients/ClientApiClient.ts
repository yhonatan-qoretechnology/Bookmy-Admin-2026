import type { HttpClient } from '../http/HttpClient';
import type { CreateClientRequest, Client } from '../../core/domain/client/ClientTypes';

export interface RegisterClientRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  firstName?: string;
  lastName?: string;
  gender?: 'Masculino' | 'Femenino';
  birthdate?: string;
  empresaId?: number;
  sedeId?: number;
  countryId?: number;
  clientType?: string;
  role?: string;
  state?: string;
  acceptTerms?: boolean;
  acceptPolitics?: boolean;
  idioma?: string;
  categoryIds?: string;
}

export class ClientApiClient {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  searchClientByEmail(email: string) {
    return this.httpClient.post<Client, { email: string }>(
      '/clients/search',
      { email },
    );
  }

  registerClient(formData: FormData) {
    return this.httpClient.post<{
      message: string;
      user: {
        id: number;
        email: string;
        clientType: string;
        state: string;
        UserData: {
          id: number;
          name: string;
          phone: string;
          email: string;
          userId: number;
          countryId: number;
          idioma: string;
          gender: string;
          birthdate: string;
        };
        AdminProfile: null;
      }
    }, FormData>('/auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  searchClients(searchTerm: string, searchType: 'email' | 'document') {
    return this.httpClient.get<Client[]>(`/clients/search?${searchType}=${encodeURIComponent(searchTerm)}`);
  }

  getClients() {
    return this.httpClient.get<Client[]>('/clients');
  }

  createClient(clientData: CreateClientRequest) {
    return this.httpClient.post<Client, CreateClientRequest>('/clients', clientData);
  }

  updateClient(id: number, clientData: Partial<CreateClientRequest>) {
    return this.httpClient.put<Client, Partial<CreateClientRequest>>(`/clients/${id}`, clientData);
  }
}
