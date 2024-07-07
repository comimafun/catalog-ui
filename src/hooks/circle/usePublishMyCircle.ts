import { circleService } from '@/services/circle';
import { useMutation } from '@tanstack/react-query';

export const usePublishMyCircle = () => {
  return useMutation({
    mutationFn: circleService.publishUnpublishMyCircle,
  });
};
