import { newTokenResponse } from '@/types/auth';
import { parseCookies } from 'nookies';
import qs from 'qs';
import { z } from 'zod';

import nookies from 'nookies';

const TOKEN_NEED_TO_REFRESH = [
  'TOKEN_EXPIRED',
  'TOKEN_INVALID',
  'TOKEN_IS_EMPTY',
];

const parseError = (err: Error | null) => {
  if (err) {
    try {
      return JSON.parse(err.message) as {
        code: number;
        error: string;
        error_id: string;
      };
    } catch (e) {
      return null;
    }
  }
  return null;
};

type RequestConfig = Omit<RequestInit, 'body'> & {
  params?: Parameters<typeof qs.stringify>[0];
  body?: Record<string, unknown> | FormData;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
};

const client = async <T>(endpoint: string, requestInit?: RequestConfig) => {
  const cookies = parseCookies();
  const accessToken = cookies.access_token;
  const { body, params, ...customConfig } = requestInit || {};
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  let queryString = '';

  if (params) {
    queryString = '?' + qs.stringify(params, { arrayFormat: 'repeat' });
  }

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const config: RequestInit = {
    credentials: 'include',
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  return fetch(baseURL + endpoint + queryString, config).then(async (res) => {
    if (res.ok) {
      return (await res.json()) as T;
    }

    const errorMessage = await res.text();
    const errObj = new Error(errorMessage);
    const err = parseError(errObj);

    if (
      err &&
      res.status === 401 &&
      TOKEN_NEED_TO_REFRESH.includes(err.error)
    ) {
      const res = await fetch(baseURL + '/api/v1/auth/refresh', {
        ...config,
      });
      if (res.ok) {
        const data = (await res.json()) as z.infer<typeof newTokenResponse>;
        nookies.set(null, 'access_token', data.data.access_token, {
          maxAge: new Date(data.data.access_token_expired_at).getTime() / 1000,
          path: '/',
        });
      }
    }

    return Promise.reject(errObj);
  });
};

export { client, parseError };
