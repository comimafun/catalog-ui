import { circleService } from '@/services/circle';
import { useMutation } from '@tanstack/react-query';

export const useSaveUnsave = () => {
  const { mutateAsync: save, isPending: savePending } = useMutation({
    mutationFn: circleService.postSaveCircle,
  });

  const { mutateAsync: unsave, isPending: unsavePending } = useMutation({
    mutationFn: circleService.deleteSaveCircle,
  });

  return {
    save,
    unsave,
    isPending: savePending || unsavePending,
  };
};
