import { eventService } from '@/services/event';
import { UpdateAttendingEventBody } from '@/types/event';
import { useMutation } from '@tanstack/react-query';

export const useUpdateEventByCircleID = () => {
  return useMutation({
    mutationFn: async ({
      circleID,
      payload,
    }: {
      circleID: number;
      payload: UpdateAttendingEventBody;
    }) => {
      const res = await eventService.putUpdateAttendingEventByCircleID(
        circleID,
        payload,
      );
      return res.data;
    },
  });
};
