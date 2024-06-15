import { circleService } from '@/services/circle';
import { useMutation } from '@tanstack/react-query';

export const usePostFandom = () => {
  return useMutation({
    mutationFn: circleService.postCreateFandom,
  });
};
