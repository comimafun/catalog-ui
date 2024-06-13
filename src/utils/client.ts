import { newTokenResponse } from '@/types/auth';
import { parseCookies } from 'nookies';
import qs from 'qs';
import { z } from 'zod';

import nookies from 'nookies';
import { setAccessToken } from './helper';

const TOKEN_NEED_TO_REFRESH = ['TOKEN_EXPIRED', 'TOKEN_INVALID'];

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
      const refreshing = await fetch(baseURL + '/api/v1/auth/refresh', {
        ...config,
        method: 'GET',
      });
      if (!refreshing.ok) {
        const refreshError = await refreshing.text();
        const refreshErrObj = new Error(refreshError);
        nookies.destroy(null, 'access_token');
        nookies.destroy(null, 'refresh_token');
        return Promise.reject(refreshErrObj);
      }

      const data = (await refreshing.json()) as z.infer<
        typeof newTokenResponse
      >;
      setAccessToken(data.data.access_token, data.data.access_token_expired_at);

      /**
       * Retry the original request with new access token
       */
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${data.data.access_token}`,
      };
      const retryRes = await fetch(baseURL + endpoint + queryString, config);
      if (retryRes.ok) {
        return (await retryRes.json()) as T;
      }

      const retryErrorMessage = await retryRes.text();
      const retryErrObj = new Error(retryErrorMessage);
      return Promise.reject(retryErrObj);
    }

    return Promise.reject(errObj);
  });
};

export { client, parseError };
