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

const client = async (endpoint: string, requestInit?: RequestInit) => {
  const { body, ...customConfig } = requestInit || {};
  const baseURL = 'http://localhost:8080';
  const headers = {
    'Content-Type': 'application/json',
  };

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
  return fetch(baseURL + endpoint, config).then(async (res) => {
    if (res.ok) {
      return await res.json();
    } else {
      const errorMessage = await res.text();
      return Promise.reject(new Error(errorMessage));
    }
  });
};

export { client, parseError };
