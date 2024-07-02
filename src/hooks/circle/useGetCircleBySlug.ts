import { useSession } from '@/components/providers/SessionProvider';
import { circleService } from '@/services/circle';
import {
  queryOptions,
  UndefinedInitialDataOptions,
  useQuery,
} from '@tanstack/react-query';
import { useRouter } from 'next/router';

type QueryFnData = Awaited<
  ReturnType<typeof circleService.getCircleBySlug>
>['data'];
type Options = Omit<UndefinedInitialDataOptions<QueryFnData>, 'queryKey'>;
type PickedOptions = Partial<
  Pick<
    Options,
    'refetchOnMount' | 'refetchOnReconnect' | 'refetchOnWindowFocus' | 'enabled'
  >
>;

export const getCircleBySlugOptions = (slug: string, options: Options) => {
  return queryOptions({
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

export const useGetCircleBySlug = (options?: {
  slug?: string;
  options?: PickedOptions;
}) => {
  const router = useRouter();
  let slug;
  if (options?.slug) {
    slug = options.slug;
  } else {
    slug = router.query.circleSlug as string;
  }
  return useQuery(getCircleBySlugOptions(slug, options?.options ?? {}));
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
