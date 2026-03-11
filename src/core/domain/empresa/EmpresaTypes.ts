export type Empresa = {
  id: number;
  nombre: string;
  telefono: string;
  email: string;
  nit: string;
  logo: string | null;
  descripcion: string;
  descripcionLarga: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  webUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateEmpresaRequest = {
  nombre: string;
  telefono: string;
  email: string;
  nit: string;
  descripcion: string;
  descripcionLarga?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  webUrl?: string;
  logo?: File | null;
};

export type UpdateEmpresaRequest = Partial<CreateEmpresaRequest>;
