import { authService } from '@/services/auth';
import { useQuery } from '@tanstack/react-query';
import { parseCookies } from 'nookies';
import { useEffect, useState } from 'react';

const FIVE_MIN_IN_MS = 5 * 60 * 1000;

export const useGetSelf = () => {
  const [initialFetch, setInitialFetch] = useState(true);
  const accessToken = parseCookies()['access_token'];

  useEffect(() => {
    if (initialFetch) {
      setInitialFetch(false);
    }
  }, []);

  return useQuery({
    queryFn: authService.getSelf,
    queryKey: ['/api/v1/auth/self'],
    enabled: !!accessToken || initialFetch,
    refetchOnWindowFocus: false,
    staleTime: FIVE_MIN_IN_MS,
    retry: 0,
  });
};
