import { useQuery } from '@tanstack/react-query';
import { useGetCircleBySlug } from './useGetCircleBySlug';
import { circleService } from '@/services/circle';

export const useGetCircleReferral = () => {
  const { data } = useGetCircleBySlug();

  return useQuery({
    queryKey: ['/v1/circle/[circleID]/referral', data?.id],
    queryFn: async () => {
      return circleService.getReferralByCircleID(data?.id ?? 0);
    },
    enabled: !!data?.id,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
};
