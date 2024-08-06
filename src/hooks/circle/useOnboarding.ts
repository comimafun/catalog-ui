import { authService } from '@/services/auth';
import { circleService } from '@/services/circle';
import { OnboardingPayload, onboardingPayload } from '@/types/circle';
import { prettifyError, setAccessToken } from '@/utils/helper';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';

export const useOnboarding = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { isPending, mutateAsync } = useMutation({
    mutationFn: circleService.postOnboarding,
  });

  const handleOnboarding = async (payload: OnboardingPayload) => {
    try {
      setIsLoading(true);
      const { data } = await mutateAsync(onboardingPayload.parse(payload));
      const { data: refresh } = await authService.getRefreshToken();
      setAccessToken(refresh.access_token, refresh.access_token_expired_at);
      toast.success('Circle created, redirecting to your page');
      router.push({
        pathname: '/[circleSlug]',
        query: {
          circleSlug: data.slug,
        },
      });
    } catch (error) {
      setIsLoading(false);
      toast.error(prettifyError(error as Error));
    }
  };

  return { isPending: isPending || isLoading, handleOnboarding };
};
