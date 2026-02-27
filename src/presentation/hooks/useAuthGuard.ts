import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredToken } from '../../core/domain/auth/AuthUtils';

export function useAuthGuard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);
}
