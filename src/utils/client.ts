import qs from 'qs';

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

const client = async <T>(
  endpoint: string,
  requestInit?: Omit<RequestInit, 'body'> & {
    params?: Parameters<typeof qs.stringify>[0];
    body?: Record<string, unknown>;
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  },
) => {
  const { body, params, ...customConfig } = requestInit || {};
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  let queryString = '';

  if (params) {
    queryString = '?' + qs.stringify(params, { arrayFormat: 'repeat' });
  }

  const config: RequestInit = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
    credentials: 'include',
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

    if (err && err.code === 401 && TOKEN_NEED_TO_REFRESH.includes(err.error)) {
      // refresh token here
    }

    return Promise.reject(errObj);
  });
};

export { client, parseError };
