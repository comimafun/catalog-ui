import { z } from 'zod';
import { backendResponseSchema } from './common';
import { circleEntity } from './circle';

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

export const userEntity = z.object({
  circle_id: z.number().nullable(),
  id: z.number(),
  name: z.string(),
  email: z.string(),
  profile_picture_url: z.string().nullable(),
});

export const selfResponse = backendResponseSchema(
  z.object({
    user: userEntity,
    circle: circleEntity.nullable(),
    access_token_expired_at: z.string(),
  }),
);

export type SelfResponse = z.infer<typeof selfResponse>;
