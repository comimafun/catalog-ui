import { circleService } from '@/services/circle';
import { UndefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

type QueryFnData = Awaited<
  ReturnType<typeof circleService.getProductsByCircleID>
>['data'];
type Options = Omit<UndefinedInitialDataOptions<QueryFnData>, 'queryKey'>;
type PickedOptions = Partial<Options>;

export const getProductsOptions = (
  {
    circleID,
  }: {
    circleID: number;
  },
  options?: PickedOptions,
) => {
  return {
    queryKey: ['/v1/circle/[circleID]/product', { circleID }],
    queryFn: async () => {
      const res = await circleService.getProductsByCircleID(circleID);
      return res.data;
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: 0,
    enabled: !!circleID,
    ...options,
  };
};

export const useGetProducts = ({ circleID }: { circleID?: number }) => {
  return useQuery(getProductsOptions({ circleID: circleID as number }));
};
