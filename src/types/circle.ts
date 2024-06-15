import { z } from 'zod';
import {
  backendResponsePagination,
  backendResponseSchema,
  optionalUrl,
  trimmedString,
  varchar255,
} from './common';
import { ACCEPTED_IMAGE_TYPES, FIVE_MB } from '@/constants/common';

export const circlesQueryParamsClient = z.object({
  search: trimmedString.optional(),
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

const fandomWorkTypeBaseEntity = z.object({
  name: z.string(),
  id: z.number(),
});

export const circleBlockEntity = z.object({
  id: z.number(),
  name: z.string(),
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
  block: circleBlockEntity.nullable(),
  bookmarked: z.boolean(),
  work_type: z.array(fandomWorkTypeBaseEntity),
  fandom: z.array(fandomWorkTypeBaseEntity),
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

const blockString = trimmedString.refine(
  (x) => {
    const split = x.split('-');
    const prefix = split[0];
    const postfix = split[1];
    return split.length === 2 || (prefix.length <= 2 && postfix.length <= 8);
  },
  {
    message: 'Invalid block format',
  },
);

export const editGeneralInfoPayload = onboardingPayloadSchema.extend({
  block: blockString.optional(),
  file:
    typeof window === 'undefined'
      ? z.any()
      : z
          .instanceof(FileList)
          .optional()
          .refine((x) => !x?.[0] || x[0].size <= FIVE_MB, {
            message: 'Max file size is 5MB',
          })
          .refine((x) => !x?.[0] || ACCEPTED_IMAGE_TYPES.includes(x[0]?.type), {
            message: 'File type must be jpg, jpeg, png, or webp',
          }),
});

export type EditGeneralInfoPayload = z.infer<typeof editGeneralInfoPayload>;

export type OnboardingPayload = z.infer<typeof onboardingPayloadSchema>;

export const fandomQueryParams = z.object({
  search: z.string().optional(),
  limit: z.number().min(1).max(20),
  page: z.number().min(1).default(1),
});

export type FandomQueryParams = z.infer<typeof fandomQueryParams>;

export const getFandomResponse = backendResponsePagination(
  fandomWorkTypeBaseEntity,
);

export const getAllWorkTypeResponse = backendResponseSchema(
  z.array(fandomWorkTypeBaseEntity),
);

export const updateCirclePayload = z.object({
  name: varchar255.optional(),
  circle_block: blockString.optional(),
  /**
   * TODO: HTML string validation
   */
  description: z.string().optional(),
  batch: z.number().optional(),
  day: z.enum(['first', 'second', 'both']).optional(),
  url: optionalUrl.optional(),
  facebook_url: optionalUrl.optional(),
  twitter_url: optionalUrl.optional(),
  instagram_url: optionalUrl.optional(),
  picture_url: optionalUrl.optional(),
  fandom_ids: z.array(z.number()).optional(),
  work_type_ids: z.array(z.number()).optional(),
});

export type UpdateCirclePayload = z.infer<typeof updateCirclePayload>;
