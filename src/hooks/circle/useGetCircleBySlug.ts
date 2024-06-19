import { useSession } from '@/components/providers/SessionProvider';
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
    queryKey: ['/v1/circle/[slug]', slug],
    queryFn: async () => {
      return (await circleService.getCircleBySlug(null, slug)).data;
    },
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!slug,
    ...options,
  });
};

export const useIsMyCircle = () => {
  const { data: circle, isLoading: isLoadingCircle } = useGetCircleBySlug();
  const { session, isLoading: isLoadingSession } = useSession();
  const isLoading = isLoadingCircle || isLoadingSession;
  const getState = () => {
    if (isLoading) {
      return 'loading';
    }

    if (!session?.circle?.id || !circle?.id) {
      return 'not-allowed';
    }

    return circle.id === session.circle.id ? 'allowed' : 'not-allowed';
  };
  const state = getState();

  return {
    isAllowed: state === 'allowed',
    isLoading: state === 'loading',
    isNotAllowed: state === 'not-allowed',
    state: state as 'allowed' | 'loading' | 'not-allowed',
  };
};
