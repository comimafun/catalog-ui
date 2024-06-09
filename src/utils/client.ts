import qs from 'qs';

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
  requestInit?: RequestInit & { params?: Parameters<typeof qs.stringify>[0] },
) => {
  const { body, params, ...customConfig } = requestInit || {};
  const baseURL = 'http://localhost:8080';
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  let queryString = '';

  if (params) {
    queryString = qs.stringify(params, { arrayFormat: 'repeat' });
  }

  const config: RequestInit = {
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
  return fetch(baseURL + endpoint + '?' + queryString, config).then(
    async (res) => {
      if (res.ok) {
        return (await res.json()) as T;
      } else {
        const errorMessage = await res.text();
        return Promise.reject(new Error(errorMessage));
      }
    },
  );
};

export { client, parseError };
