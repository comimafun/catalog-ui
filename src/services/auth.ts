import { newTokenResponse } from '@/types/auth';
import { client } from '@/utils/client';

const authService = {
  googleCallback: async (code: string) => {
    const res = await client('/api/v1/auth/google/callback', {
      method: 'POST',
      body: { code },
    });
    const parse = newTokenResponse.parse(res);
    return parse;
  },
};

export { authService };
