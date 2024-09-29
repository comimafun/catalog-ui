import { circleService } from '@/services/circle';
import { UpdateCirclePayload } from '@/types/circle';
import { useMutation } from '@tanstack/react-query';

export const useUpdateCircle = () => {
  const updateMutation = useMutation({
    mutationFn: async ({
      circleID,
      payload,
    }: {
      circleID: number;
      payload: UpdateCirclePayload;
    }) => {
      const res = await circleService.patchUpdateCircleByID(circleID, payload);
      return res.data;
    },
  });

  return updateMutation;
};
