import { useSession } from '@/components/providers/SessionProvider';
import { circleService } from '@/services/circle';
import { GetCircleQueryParamsClient } from '@/types/circle';
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';

export const getBookmarkedCirclesOptions = (
  params: Partial<GetCircleQueryParamsClient>,
  options?: Partial<{
    enabled: boolean;
  }>,
) => {
  return infiniteQueryOptions({
    queryKey: ['/v1/circle/bookmarked', params],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await circleService.getBookmarkedCircles({
        ...params,
        limit: 18,
        page: pageParam,
      });
      return res;
    },
    getNextPageParam: (last) => {
      if (last.metadata.has_next_page) return last.metadata.page + 1;
      return undefined;
    },
    refetchOnWindowFocus: false,
    initialPageParam: 1,
    ...options,
  });
};

export const useGetBookmarkedCirclesInfinite = (
  params: Partial<GetCircleQueryParamsClient>,
) => {
  const { session } = useSession();
  const res = useInfiniteQuery(
    getBookmarkedCirclesOptions(params, { enabled: !!session }),
  );
  const result = res.data?.pages.flatMap((page) => page.data) ?? [];

  return {
    ...res,
    result,
  };
};
