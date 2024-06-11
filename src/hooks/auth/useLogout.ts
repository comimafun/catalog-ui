import { authService } from '@/services/auth';
import { prettifyError } from '@/utils/helper';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import nookies from 'nookies';

export const useLogout = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: authService.postLogout,
  });
  const logout = async () => {
    try {
      await mutateAsync();
      nookies.destroy(null, 'access_token');
      window.location.href = '/';
    } catch (error) {
      toast.error(prettifyError(error as Error));
    }
  };

  return {
    logout,
    isPending,
  };
};
