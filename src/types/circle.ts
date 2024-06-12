import { z } from 'zod';
import {
  backendResponsePagination,
  backendResponseSchema,
  optionalUrl,
} from './common';

export const getCirclesQueryParams = z.object({
  search: z.string().optional(),
  limit: z.number().min(1).max(20),
  page: z.number().min(1),
  work_type_id: z
    .array(z.coerce.number())
    .or(z.coerce.number().transform((x) => [x]))
    .optional(),
  fandom_id: z
    .array(z.coerce.number())
    .or(z.coerce.number().transform((x) => [x]))
    .optional(),
});

export type GetCircleQueryParams = z.infer<typeof getCirclesQueryParams>;

const fandomWorkTypeSchema = z.object({
  name: z.string(),
  id: z.number(),
});

export const circleEntity = z.object({
  id: z.number(),
  batch: z.number().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  day: z.enum(['first', 'second', 'both']).nullable(),
  description: z.string().nullable(),
  facebook_url: z.string().nullable(),
  twitter_url: z.string().nullable(),
  picture_url: z.string().nullable(),
  instagram_url: z.string().nullable(),
  slug: z.string(),
  name: z.string(),
  published: z.boolean(),
  verified: z.boolean(),
});

export const circleSchema = circleEntity.extend({
  block: z.string().nullable(),
  bookmarked: z.boolean(),
  work_type: z.array(fandomWorkTypeSchema),
  fandom: z.array(fandomWorkTypeSchema),
});

export const onboardCircleResponse = backendResponseSchema(circleSchema);

export const getCirclesResponse = backendResponsePagination(circleSchema);

export const onboardingPayloadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Name is required' })
    .max(255, { message: 'Name is too long' }),
  url: optionalUrl,
  picture_url: optionalUrl,
  twitter_url: optionalUrl,
  instagram_url: optionalUrl,
  facebook_url: optionalUrl,
});

export type OnboardingPayload = z.infer<typeof onboardingPayloadSchema>;
