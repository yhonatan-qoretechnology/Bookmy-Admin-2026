export interface Client {
  id: number;
  email: string;
  clientType: string;
  state: string;
  createdAt: string;
  updatedAt?: string;
  fotoPerfil?: string | null;
  role: string;
  UserData?: {
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
  UserCategories?: Array<{
    userId: number;
    categoryId: number;
    createdAt: string;
    category: {
      id: number;
      createdAt: string;
      updatedAt: string;
      image: string;
    };
  }>;
  AdminProfile?: null | {
    id: number;
    userId: number;
    firstName: string;
    lastName: string;
    phone: string;
    photoUrl: string | null;
    empresaId: number;
    sedeId: number;
    createdAt: string;
    updatedAt: string;
  };
}

export interface CreateClientRequest {
  name: string;
  email: string;
  phone?: string;
  document?: string;
}
