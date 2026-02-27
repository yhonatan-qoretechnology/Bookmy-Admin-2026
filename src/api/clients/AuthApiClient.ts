import type { HttpClient } from '../http/HttpClient';
import type {
  LoginRequestDto,
  LoginResponseDto,
} from '../../core/domain/auth/AuthTypes';

export class AuthApiClient {
  constructor(private readonly httpClient: HttpClient) {}

  login(data: LoginRequestDto) {
    return this.httpClient.post<LoginResponseDto, LoginRequestDto>(
      '/auth/login',
      data,
    );
  }

  logout() {
    return this.httpClient.post<void, undefined>('/auth/logout');
  }

  refreshToken() {
    return this.httpClient.post<LoginResponseDto, undefined>('/auth/refresh');
  }
}
