import { circleService } from '@/services/circle';
import { OnboardingPayload } from '@/types/circle';
import { prettifyError } from '@/utils/helper';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

export const useOnboarding = () => {
  const router = useRouter();
  const { isPending, mutateAsync } = useMutation({
    mutationFn: circleService.postOnboarding,
  });

  const handleOnboarding = async (payload: OnboardingPayload) => {
    try {
      const { data } = await mutateAsync(payload);
      toast.success('Circle created, redirecting to your page');
      router.push({
        pathname: '/c/[slug]',
        query: {
          slug: data.slug,
        },
      });
    } catch (error) {
      toast.error(prettifyError(error as Error));
    }
  };

  return { isPending, handleOnboarding };
};
