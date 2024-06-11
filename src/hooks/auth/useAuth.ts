import { authService } from '@/services/auth';
import { useQuery } from '@tanstack/react-query';
import { parseCookies } from 'nookies';

export const useGetSelf = () => {
  const accessToken = parseCookies();

  return useQuery({
    queryFn: authService.getSelf,
    queryKey: ['/api/v1/auth/self'],
    enabled: !!accessToken,
    refetchOnWindowFocus: false,
  });
};
