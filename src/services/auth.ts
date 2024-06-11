import { newTokenResponse, selfResponse } from '@/types/auth';
import { client } from '@/utils/client';

const authService = {
  googleCallback: async (code: string) => {
    const res = await client('/api/v1/auth/google/callback', {
      method: 'POST',
      body: { code },
    });
    return newTokenResponse.parse(res);
  },
  getSelf: async () => {
    const res = await client('/api/v1/auth/self');
    return selfResponse.parse(res).data;
  },
  postLogout: () =>
    client('/api/v1/auth/logout', {
      method: 'POST',
    }),
};

export { authService };
