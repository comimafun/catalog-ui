import { circleService } from '@/services/circle';
import { useQuery } from '@tanstack/react-query';

export const useGetWorkType = () => {
  return useQuery({
    queryKey: ['/api/v1/worktype/all'],
    queryFn: async () => {
      return (await circleService.getAllWorkTypes()).data;
    },
    retry: 0,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    staleTime: 1000 * 60 * 60 * 24,
  });
};
