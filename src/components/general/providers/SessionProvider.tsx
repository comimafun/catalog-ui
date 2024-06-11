import { useGetSelf } from '@/hooks/auth/useAuth';
import { SelfResponse } from '@/types/auth';
import { createContext, useContext } from 'react';

const ctx = createContext<{
  session?: SelfResponse['data'];
  isLoading?: boolean;
} | null>(null);

const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading } = useGetSelf();
  return (
    <ctx.Provider
      value={{
        session: data,
        isLoading,
      }}
    >
      {children}
    </ctx.Provider>
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
