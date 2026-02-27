export interface AdminProfile {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  phone: string;
  photoUrl: string | null;
  empresaId: number;
  sedeId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserData {
  id: number;
  name: string;
  phone: string;
  email: string;
  userId: number;
  countryId: number;
  idioma: string;
  gender: string;
  birthdate: string;
}

export interface Admin {
  id: number;
  email: string;
  clientType: string;
  state: string;
  acceptTerms: boolean;
  acceptPolitics: boolean;
  createdAt: string;
  updatedAt: string;
  fotoPerfil: string | null;
  role: string;
  AdminProfile: AdminProfile;
  UserData: UserData;
}
