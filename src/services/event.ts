import { getOneCircleResponse } from '@/types/circle';
import {
  getEventPaginationSchema,
  UpdateAttendingEventBody,
} from '@/types/event';
import { fetchInstance } from '@/utils/fetch-wrapper';

export const eventService = {
  getEvents: async (params: { page: number; limit: number }) => {
    const res = await fetchInstance(null, '/v1/event', { params });
    return getEventPaginationSchema.parse(res);
  },
  putUpdateAttendingEventByCircleID: async (
    circleID: number,
    body: UpdateAttendingEventBody,
  ) => {
    const res = await fetchInstance(null, `/v1/circle/${circleID}/event`, {
      body,
      method: 'PUT',
    });

    return getOneCircleResponse.parse(res);
  },

  deleteAttendingEventByCircleID: async (circleID: number) => {
    const res = await fetchInstance(null, `/v1/circle/${circleID}/event`, {
      method: 'DELETE',
    });
    return getOneCircleResponse.parse(res);
  },
};
