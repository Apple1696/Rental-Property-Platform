import { useCallback } from 'react';

export const useAuth = () => {
  const getToken = useCallback(() => {
    return localStorage.getItem('token');
  }, []);

  const isAuthenticated = !!getToken();

  return {
    isAuthenticated,
    getToken,
  };
}; 