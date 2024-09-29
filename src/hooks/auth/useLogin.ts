import { authService } from '@/services/auth';
import { onSuccessGoogleResponseSchema } from '@/types/auth';
import { prettifyError, setAccessToken } from '@/utils/helper';
import { useGoogleLogin } from '@react-oauth/google';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const signIn = useGoogleLogin({
    flow: 'auth-code',
    ux_mode: 'popup',
    onSuccess: async (response) => {
      try {
        const parsed = onSuccessGoogleResponseSchema.parse(response);
        const { data } = await authService.googleCallback(parsed.code);

        setAccessToken(data.access_token, data.access_token_expired_at);

        const self = await authService.getSelf();
        queryClient.setQueryData(['/v1/auth/self'], self);

        toast.success('Welcome to Inner Catalog!❤️');
        if (router.query.return_url) {
          router.push(router.query.return_url as string);
        } else {
          router.push('/');
        }
      } catch (error) {
        const msg = prettifyError(error as Error);
        toast.error(msg);
      }
    },
  });

  return {
    signIn,
  };
};
