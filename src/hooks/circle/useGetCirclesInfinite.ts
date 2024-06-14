import { circleService } from '@/services/circle';
import { GetCircleQueryParamsClient } from '@/types/circle';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useGetCirclesInfinite = (
  params: Partial<GetCircleQueryParamsClient>,
) => {
  const res = useInfiniteQuery({
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
  });

  const result = res.data?.pages.flatMap((page) => page.data) ?? [];

  return {
    ...res,
    result,
  };
};
