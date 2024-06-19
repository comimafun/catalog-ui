import { ZodError } from 'zod';
import nookies from 'nookies';
import { parseError } from './fetch-wrapper';
import DOMPurify from 'isomorphic-dompurify';

export const prettifyError = (error: Error | null) => {
  console.error(error);
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

export const sanitizeHtmlString = (html: string) => {
  const cleaned = DOMPurify.sanitize(html);
  return cleaned;
};
