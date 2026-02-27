import type { AuthRepository } from '../../core/domain/auth/AuthRepository';
import type { AuthApiClient } from '../../api/clients/AuthApiClient';
import type {
  LoginRequestDto,
  LoginResponseDto,
} from '../../core/domain/auth/AuthTypes';

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly apiClient: AuthApiClient) {}

  async login(credentials: LoginRequestDto): Promise<LoginResponseDto> {
    const response = await this.apiClient.login(credentials);

    if (!response.ok || !response.data) {
      throw new Error('Login failed');
    }

    return response.data;
  }

  async logout(): Promise<void> {
    console.log('AuthRepositoryImpl: calling logout API');
    const response = await this.apiClient.logout();
    console.log('AuthRepositoryImpl: logout API response', response);
    if (!response.ok) {
      throw new Error('Logout failed');
    }
    console.log('AuthRepositoryImpl: logout successful');
  }
}
