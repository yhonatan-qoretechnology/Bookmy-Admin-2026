import { useState } from 'react';
import { FetchHttpClient } from '../../api/http/FetchHttpClient';
import { AuthApiClient } from '../../api/clients/AuthApiClient';
import { AuthRepositoryImpl } from '../../infrastructure/repositories/AuthRepositoryImpl';
import { LogoutUseCase } from '../../core/usecases/auth/LogoutUseCase';

const httpClient = new FetchHttpClient();
const authApiClient = new AuthApiClient(httpClient);
const authRepository = new AuthRepositoryImpl(authApiClient);
const logoutUseCase = new LogoutUseCase(authRepository);

export function useLogout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = async (): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      console.log('Calling logout use case...');
      try {
        await logoutUseCase.execute();
        console.log('Logout use case executed');
      } catch (err) {
        console.warn('Remote logout failed, continuing with local logout...', err);
      }

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      console.log('Tokens cleared from localStorage');

      return true;
    } catch (err) {
      console.error('Logout error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error');
      }
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return true;
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading, error };
}
