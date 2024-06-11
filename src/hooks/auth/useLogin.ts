import { authService } from '@/services/auth';
import { onSuccessGoogleSchema } from '@/types/auth';
import { prettifyError } from '@/utils/helper';
import { useGoogleLogin } from '@react-oauth/google';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import nookies from 'nookies';
import toast from 'react-hot-toast';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const signIn = useGoogleLogin({
    flow: 'auth-code',
    ux_mode: 'popup',
    redirect_uri: 'http://localhost:3000',
    onSuccess: async (response) => {
      try {
        const parsed = onSuccessGoogleSchema.parse(response);
        const { data } = await authService.googleCallback(parsed.code);

        nookies.set(null, 'access_token', data.access_token, {
          maxAge: new Date(data.access_token_expired_at).getTime() / 1000,
          path: '/',
        });

        const self = await authService.getSelf();
        queryClient.setQueryData(['/api/v1/auth/self'], self);

        toast.success('Welcome to ComimaFun!');
        router.push('/');
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
