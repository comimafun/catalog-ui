import { z } from 'zod';
import {
  backendResponsePagination,
  backendResponseSchema,
  optionalUrl,
} from './common';

export const circlesQueryParamsClient = z.object({
  search: z.string().optional().or(z.literal('')),
  work_type_id: z
    .array(z.coerce.number())
    .or(z.coerce.number().transform((x) => [x]))
    .default([]),
  fandom_id: z
    .array(z.coerce.number())
    .or(z.coerce.number().transform((x) => [x]))
    .default([]),
  day: z
    .enum(['first', 'second', 'both'])
    .or(z.literal(''))
    .default('')
    .optional(),
});

export type GetCircleQueryParamsClient = z.infer<
  typeof circlesQueryParamsClient
>;

export const getCirclesQueryParams = circlesQueryParamsClient.partial().extend({
  limit: z.number().min(1).max(20),
  page: z.number().min(1).default(1),
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
  url: z.string().nullable(),
  facebook_url: z.string().nullable(),
  twitter_url: z.string().nullable(),
  picture_url: z.string().nullable(),
  instagram_url: z.string().nullable(),
  slug: z.string(),
  name: z.string(),
  published: z.boolean(),
  verified: z.boolean(),
});

export const productEntity = z.object({
  id: z.number(),
  name: z.string(),
  image_url: z.string(),
});

export const circleSchema = circleEntity.extend({
  block: z.string().nullable(),
  bookmarked: z.boolean(),
  work_type: z.array(fandomWorkTypeSchema),
  fandom: z.array(fandomWorkTypeSchema),
  product: z.array(productEntity),
});

export type CircleCard = Omit<z.infer<typeof circleSchema>, 'product'>;

export const onboardCircleResponse = backendResponseSchema(circleEntity);
export const getOneCircleResponse = backendResponseSchema(circleSchema);
export const getCirclesResponse = backendResponsePagination(
  circleSchema.omit({ product: true }),
);

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

export const fandomQueryParams = z.object({
  search: z.string().optional(),
  limit: z.number().min(1).max(20),
  page: z.number().min(1).default(1),
});

export type FandomQueryParams = z.infer<typeof fandomQueryParams>;

export const getFandomResponse =
  backendResponsePagination(fandomWorkTypeSchema);

export const getAllWorkTypeResponse = backendResponseSchema(
  z.array(fandomWorkTypeSchema),
);
