export interface User {
  id: string;
  name: string;
  email: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
  refreshToken?: string;
  user: User;
}
