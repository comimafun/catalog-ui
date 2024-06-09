import { z } from 'zod';
import { backendResponseSchema } from './common';

export const onSuccessGoogleSchema = z.object({
  code: z.string(),
});

export const newTokenResponse = backendResponseSchema(
  z.object({
    access_token: z.string(),
    refresh_token: z.string(),
    access_token_expired_at: z.string(),
    refresh_token_expired_at: z.string(),
  }),
);
