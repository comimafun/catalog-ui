import { useGetSelf } from '@/hooks/auth/useGetSelf';
import { getCircleBySlugOptions } from '@/hooks/circle/useGetCircleBySlug';
import { getCirclesOptions } from '@/hooks/circle/useGetCirclesInfinite';
import { SelfResponse } from '@/types/auth';
import { useQueryClient } from '@tanstack/react-query';
import { parseCookies } from 'nookies';

import {
  createContext,
  RefObject,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';

const ctx = createContext<{
  session?: SelfResponse['data'];
  isLoading?: boolean;
  windowRef: RefObject<HTMLDivElement>;
} | null>(null);

const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading } = useGetSelf();
  const accessToken = parseCookies()['access_token'];
  const queryClient = useQueryClient();
  const windowRef = useRef<HTMLDivElement>(null);

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
    () => ({ session: data, isLoading, windowRef }),
    [data, isLoading],
  );

  return (
    <div
      className="h-screen w-screen overflow-y-auto overflow-x-hidden"
      ref={windowRef}
    >
      <ctx.Provider value={value}>{children}</ctx.Provider>
    </div>
  );
};

export const useSession = () => {
  const value = useContext(ctx);
  if (!value) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return value;
};

export { SessionProvider };
