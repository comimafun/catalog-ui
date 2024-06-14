import { GetServerSidePropsContext } from 'next';
import QueryString from 'qs';
import nookies from 'nookies';
import { newTokenResponse } from '@/types/auth';
import { z } from 'zod';

const TOKEN_NEED_TO_REFRESH = ['TOKEN_INVALID', 'TOKEN_EXPIRED'];

/**
 * Parses the error message and returns the error object if possible.
 * @param err - The error object to parse.
 * @returns The parsed error object or null if parsing fails.
 */
export const parseError = (err: Error | null) => {
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

type RequestInitConfig = Omit<RequestInit, 'body'> & {
  params?: any;
  body?: Record<string, unknown> | FormData;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
};

export type FetchContext = Parameters<typeof fetchInstance>[0];

/**
 * Fetch wrapper that automatically sets the access token to headers, refreshes the token if needed,
 * and retries the original request with the new access token.
 * Can be used in both client and server-side.
 * Automatically stringifies query params and body.
 *
 * @example fetchInstance(null, `/v1/circle/${circleSlug}`)
 * @example fetchInstance(null, '/v1/circle/onboard', { body: { circle_id: 1 } })
 * @example fetchInstance(c as GetServerSidePropsContext, '/v1/circle', { params: { limit: 10 } })
 *
 * @param c - Context object for server-side fetch, null if it's client-side fetch (e.g., useQuery).
 * @param endpoint - The API endpoint to fetch.
 * @param requestInit - Additional request configuration options.
 * @returns A Promise that resolves to the fetched data.
 */
export const fetchInstance = async <T>(
  c: GetServerSidePropsContext | null,
  endpoint: string,
  requestInit?: RequestInitConfig,
) => {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  let queryString = '';
  const accessToken = nookies.get(c).access_token;

  const {
    body,
    params,
    headers: customHeaders,
    ...customConfig
  } = requestInit || {};
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  if (params) {
    queryString =
      '?' + QueryString.stringify(params, { arrayFormat: 'repeat' });
  }

  const config: RequestInit = {
    credentials: 'include',
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customHeaders,
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
      const refreshing = await fetch(baseURL + '/v1/auth/refresh', {
        ...config,
        method: 'GET',
        headers: {
          ...config.headers,
          'Content-Type': 'application/json',
        },
      });

      if (!refreshing.ok) {
        const refreshError = await refreshing.text();
        const refreshErrObj = new Error(refreshError);
        nookies.destroy(c, 'access_token');
        nookies.destroy(c, 'refresh_token');
        return Promise.reject(refreshErrObj);
      }

      const data = (await refreshing.json()) as z.infer<
        typeof newTokenResponse
      >;

      nookies.set(c, 'access_token', data.data.access_token, {
        path: '/',
      });

      // Retry the original request with the new access token
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
