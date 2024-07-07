import { eventService } from '@/services/event';
import { useQuery } from '@tanstack/react-query';

export const useGetEvents = (
  params: Parameters<typeof eventService.getEvents>[0],
) => {
  return useQuery({
    queryKey: ['/v1/event', params],
    queryFn: async () => (await eventService.getEvents(params)).data,
    retry: 0,
    refetchOnMount: false,
  });
};
