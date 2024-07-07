import { circleService } from '@/services/circle';
import { useMutation } from '@tanstack/react-query';

export const useUpdateCircle = () => {
  const updateMutation = useMutation({
    mutationFn: async ({
      circleID,
      payload,
    }: {
      circleID: number;
      payload: Parameters<typeof circleService.patchUpdateCircleByID>[1];
    }) => {
      const res = await circleService.patchUpdateCircleByID(circleID, payload);
      return res.data;
    },
  });

  return updateMutation;
};
