import { ZodError } from 'zod';
import { parseError } from './client';
import nookies from 'nookies';

export const prettifyError = (error: Error | null) => {
  if (error instanceof ZodError) {
    const fields = Object.entries(error.flatten().fieldErrors).map(
      ([field, err]) => {
        const message = err ? err.join(', ') : 'SCHEMA_ERROR';
        return `${field}: ${message}}`;
      },
    );
    return fields.join(' | ');
  }

  const apiError = parseError(error);
  if (apiError) {
    return `${apiError.code} ${apiError.error} (${apiError.error_id})`;
  }

  if (error?.message) {
    return error.message;
  }

  return 'Something went wrong, please contact support.';
};

export const setAccessToken = (accessToken: string, _expires: string) => {
  nookies.set(null, 'access_token', accessToken, {
    // expires: new Date(expires),
    path: '/',
  });
};
