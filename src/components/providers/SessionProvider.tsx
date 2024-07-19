import { useGetSelf } from '@/hooks/auth/useGetSelf';
import { getCircleBySlugOptions } from '@/hooks/circle/useGetCircleBySlug';
import { getCirclesOptions } from '@/hooks/circle/useGetCirclesInfinite';
import { SelfResponse } from '@/types/auth';
import { useQueryClient } from '@tanstack/react-query';
import { parseCookies } from 'nookies';

import { createContext, useContext, useEffect, useMemo } from 'react';

const ctx = createContext<{
  session?: SelfResponse['data'];
  isLoading?: boolean;
} | null>(null);

const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading } = useGetSelf();
  const accessToken = parseCookies()['access_token'];
  const queryClient = useQueryClient();

  const invalidateIfAuthedQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: [getCircleBySlugOptions(null, '', {}).queryKey[0]],
        exact: false,
        refetchType: 'active',
      }),
      queryClient.invalidateQueries({
        queryKey: [getCirclesOptions({}).queryKey[0]],
        exact: false,
        refetchType: 'active',
      }),
      queryClient.invalidateQueries({
        queryKey: ['/v1/auth/self'],
        refetchType: 'active',
        exact: false,
      }),
    ]);
  };

  useEffect(() => {
    if (accessToken) {
      invalidateIfAuthedQueries();
    }
  }, [accessToken]);

  const value = useMemo(
    () => ({ session: data, isLoading }),
    [data, isLoading],
  );

  return <ctx.Provider value={value}>{children}</ctx.Provider>;
};

export const useSession = () => {
  const value = useContext(ctx);
  if (!value) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return value;
};

export { SessionProvider };
