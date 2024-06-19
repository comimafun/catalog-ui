import { getEventPaginationSchema } from '@/types/event';
import { fetchInstance } from '@/utils/fetch-wrapper';

export const eventService = {
  getEvents: async (params: { page: number; limit: number }) => {
    const res = await fetchInstance(null, '/v1/event', { params });
    return getEventPaginationSchema.parse(res);
  },
};
