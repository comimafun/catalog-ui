import { circleService } from '@/services/circle';
import { CircleRouterQueryParamsSchema } from '@/types/circle';
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import { useMediaQuery } from '../common/useMediaQuery';
import { useMemo } from 'react';
import { chunk } from '@/utils/helper';

export const getCirclesOptions = (
  params: Partial<CircleRouterQueryParamsSchema>,
) => {
  return infiniteQueryOptions({
    initialPageParam: 1,
    queryKey: ['/v1/circle', params],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await circleService.getCircles({
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
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

export const useGetCirclesInfinite = (
  params: Partial<CircleRouterQueryParamsSchema>,
) => {
  const res = useInfiniteQuery(getCirclesOptions(params));
  const result = res.data?.pages.flatMap((page) => page.data) ?? [];
  const isLargeScreen = useMediaQuery('(min-width: 640px)');

  const chunked = useMemo(
    () => chunk(result, isLargeScreen ? 3 : 2),
    [isLargeScreen, result],
  );

  return {
    ...res,
    result,
    chunked,
  };
};
