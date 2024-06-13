import { circleService } from '@/services/circle';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

export const useGetCircleBySlug = (options?: {
  slug?: string;
  options: {
    refetchOnMount?: boolean;
    refetchOnReconnect?: boolean;
    refetchOnWindowFocus?: boolean;
    enabled?: boolean;
  };
}) => {
  const router = useRouter();
  let slug;
  if (options?.slug) {
    slug = options.slug;
  } else {
    slug = router.query.circleSlug as string;
  }
  return useQuery({
    queryKey: ['/api/v1/circle', slug],
    queryFn: async () => {
      return (await circleService.getCircleBySlug(slug)).data;
    },
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!slug,
    ...options,
  });
};
