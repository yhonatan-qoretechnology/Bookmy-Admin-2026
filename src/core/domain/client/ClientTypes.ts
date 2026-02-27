export interface Client {
  id: number;
  name: string;
  email: string;
  phone?: string;
  document?: string;
  state: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientRequest {
  name: string;
  email: string;
  phone?: string;
  document?: string;
}
