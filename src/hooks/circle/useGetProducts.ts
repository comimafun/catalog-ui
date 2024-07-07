import { circleService } from '@/services/circle';
import { useQuery } from '@tanstack/react-query';

export const useGetProducts = ({ circleID }: { circleID?: number }) => {
  return useQuery({
    queryKey: ['/v1/circle/[circleID]/product', { circleID }],
    queryFn: async () => {
      const res = await circleService.getProductsByCircleID(circleID as number);
      return res.data;
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: 0,
    enabled: !!circleID,
  });
};
