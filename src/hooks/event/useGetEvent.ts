import { eventService } from '@/services/event';
import { UndefinedInitialDataOptions, useQuery } from '@tanstack/react-query';
type QueryFnData = Awaited<ReturnType<typeof eventService.getEvents>>['data'];
type Options = Omit<UndefinedInitialDataOptions<QueryFnData>, 'queryKey'>;
type PickedOptions = Partial<
  Pick<
    Options,
    | 'refetchOnMount'
    | 'refetchOnReconnect'
    | 'refetchOnWindowFocus'
    | 'enabled'
    | 'staleTime'
  >
>;

type Params = Parameters<typeof eventService.getEvents>[0];

export const useGetEvents = (params: Params, options?: PickedOptions) => {
  return useQuery({
    queryKey: ['/v1/event', params],
    queryFn: async () => (await eventService.getEvents(params)).data,
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    ...options,
  });
};
