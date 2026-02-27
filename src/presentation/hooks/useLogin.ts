import { useState } from 'react';
import { FetchHttpClient } from '../../api/http/FetchHttpClient';
import { AuthApiClient } from '../../api/clients/AuthApiClient';
import { AuthRepositoryImpl } from '../../infrastructure/repositories/AuthRepositoryImpl';
import { LoginUseCase } from '../../core/usecases/auth/LoginUseCase';
import type {
  LoginRequestDto,
  LoginResponseDto,
} from '../../core/domain/auth/AuthTypes';

const httpClient = new FetchHttpClient();
const authApiClient = new AuthApiClient(httpClient);
const authRepository = new AuthRepositoryImpl(authApiClient);
const loginUseCase = new LoginUseCase(authRepository);

type LoginResponseWithToken = LoginResponseDto & { token?: string };

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (
    credentials: LoginRequestDto,
  ): Promise<LoginResponseDto | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await loginUseCase.execute(credentials);
      
      console.log('Login result:', result);
      
      const token = result.accessToken || (result as LoginResponseWithToken).token;
      if (token) {
        localStorage.setItem('accessToken', token);
        if (result.refreshToken) {
          localStorage.setItem('refreshToken', result.refreshToken);
        }
        localStorage.setItem('user', JSON.stringify(result.user));
        return result;
      } else {
        throw new Error('No token received from login');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}
