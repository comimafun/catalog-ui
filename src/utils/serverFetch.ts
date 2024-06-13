import { GetServerSidePropsContext } from 'next';
import QueryString from 'qs';
import nookies from 'nookies';

export const serverFetch = async <T>(
  c: GetServerSidePropsContext,
  endpoint: string,
  requestInit?: RequestInit & { params: any },
) => {
  const cookies = nookies.get(c);
  const accessToken = cookies.access_token;
  const {
    body,
    params,
    headers: customHeaders,
    ...customConfig
  } = requestInit || {};
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  let queryString = '';

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
    return Promise.reject(errObj);
  });
};
