import { circleService } from '@/services/circle';
import { FandomQueryParams } from '@/types/circle';
import { useQuery } from '@tanstack/react-query';

export const useGetFandom = (params: FandomQueryParams) => {
  return useQuery({
    queryKey: ['/v1/fandom', params],
    queryFn: async () => {
      return (await circleService.getFandoms(params)).data;
    },
    retry: 0,
  });
};
