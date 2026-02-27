import type { LoginRequestDto, LoginResponseDto } from './AuthTypes';

export interface AuthRepository {
  login(credentials: LoginRequestDto): Promise<LoginResponseDto>;
  logout(): Promise<void>;
}
