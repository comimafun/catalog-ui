import { ZodError } from 'zod';
import { parseError } from './client';

export const parseErrorMessage = (error: Error | null) => {
  if (error instanceof ZodError) {
    return `CLIENT_ERROR: field ${error.errors.map((e) => e.message).join(', ')}`;
  }

  const apiError = parseError(error);
  if (apiError) {
    return `${apiError.code} ${apiError.error} (${apiError.error_id})`;
  }

  return 'Something went wrong, please contact support.';
};
