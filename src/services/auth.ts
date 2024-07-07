import { newTokenResponse, selfResponse } from '@/types/auth';
import { fetchInstance } from '@/utils/fetch-wrapper';

const authService = {
  googleCallback: async (code: string) => {
    const res = await fetchInstance(null, '/v1/auth/google/callback', {
      method: 'POST',
      body: { code },
    });
    return newTokenResponse.parse(res);
  },
  getSelf: async () => {
    const res = await fetchInstance(null, '/v1/auth/self');
    return selfResponse.parse(res).data;
  },
  postLogout: () =>
    fetchInstance(null, '/v1/auth/logout', {
      method: 'POST',
    }),
  getRefreshToken: async () => {
    const res = await fetchInstance(null, '/v1/auth/refresh');
    return newTokenResponse.parse(res);
  },
};

export { authService };
