import { z } from 'zod';
import {
  backendResponsePagination,
  backendResponseSchema,
  blockString,
  dayEnum,
  optionalUrl,
  trimmedString,
  varchar255,
} from './common';
import { ACCEPTED_IMAGE_TYPES, FIVE_MB } from '@/constants/common';
import { eventEntity } from './event';

export const RATING_ENUM = ['GA', 'PG', 'M'] as const;
export const ratingEnumSchema = z.enum(RATING_ENUM, {
  message: 'Rating is required',
});
export const circleRouterQueryParamsSchema = z.object({
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
  rating: z
    .array(ratingEnumSchema)
    .or(ratingEnumSchema.transform((x) => [x]))
    .default([]),

  event: trimmedString.optional(),
});
export const getCirclesQueryParams = circleRouterQueryParamsSchema
  .partial()
  .extend({
    limit: z.number().min(1).max(20),
    page: z.number().min(1).default(1),
  });

export const fandomWorkTypeBaseEntity = z.object({
  name: z.string(),
  id: z.number(),
});
export const circleBlockEntity = z.object({
  id: z.number(),
  name: z.string(),
});
export const circleEntity = z.object({
  id: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  day: dayEnum.nullable(),
  description: z.string().nullable(),
  url: z.string().nullable(),
  cover_picture_url: z.string().nullable(),
  facebook_url: z.string().nullable(),
  twitter_url: z.string().nullable(),
  picture_url: z.string().nullable(),
  instagram_url: z.string().nullable(),
  slug: z.string(),
  name: z.string(),
  published: z.boolean(),
  verified: z.boolean(),
  event_id: z.number().nullable(),
  rating: ratingEnumSchema.nullable(),
});
export type CircleEntity = z.infer<typeof circleEntity>;
export const circleJoinedSchema = circleEntity.extend({
  block: circleBlockEntity.nullable(),
  bookmarked: z.boolean(),
  work_type: z.array(fandomWorkTypeBaseEntity),
  fandom: z.array(fandomWorkTypeBaseEntity),
  event: eventEntity.nullable(),
});
export const onboardCircleResponse = backendResponseSchema(circleEntity);
export const getOneCircleResponse = backendResponseSchema(
  circleJoinedSchema.omit({ event_id: true }),
);
export const circlePaginationSchema = circleEntity
  .omit({ description: true })
  .extend({
    block: circleBlockEntity.nullable(),
    bookmarked: z.boolean(),
    work_type: z.array(fandomWorkTypeBaseEntity),
    fandom: z.array(fandomWorkTypeBaseEntity),
    event: eventEntity
      .omit({ description: true, ended_at: true, started_at: true })
      .nullable(),
  });
export const getCirclesResponse = backendResponsePagination(
  circlePaginationSchema,
);
export const onboardingPayload = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Name is required' })
    .max(255, { message: 'Name is too long' }),
  rating: ratingEnumSchema,
  url: optionalUrl,
  picture_url: optionalUrl,
  twitter_url: optionalUrl,
  instagram_url: optionalUrl,
  facebook_url: optionalUrl,
  referral_code: z
    .string()
    .trim()
    .transform((x) => (x === '' ? undefined : x.toUpperCase()))
    .optional(),
});
export const editGeneralInfoFormSchema = onboardingPayload.extend({
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
export const fandomQueryParams = z.object({
  search: z.string().optional(),
  limit: z.number().min(1).max(20),
  page: z.number().min(1).default(1),
});
export const getFandomResponse = backendResponsePagination(
  fandomWorkTypeBaseEntity,
);
export const getAllWorkTypeResponse = backendResponseSchema(
  z.array(fandomWorkTypeBaseEntity),
);
export const updateCirclePayload = z.object({
  name: varchar255.optional(),
  description: z.string().optional(),
  url: optionalUrl.optional(),
  facebook_url: optionalUrl.optional(),
  twitter_url: optionalUrl.optional(),
  instagram_url: optionalUrl.optional(),
  picture_url: optionalUrl.optional(),
  fandom_ids: z.array(z.number()).optional(),
  work_type_ids: z.array(z.number()).optional(),
  cover_picture_url: optionalUrl.optional(),
  rating: ratingEnumSchema.optional(),
});

const circleFilterWithNoSearch = circleRouterQueryParamsSchema.omit({
  search: true,
});

export type CircleRouterQueryParamsSchema = z.infer<
  typeof circleRouterQueryParamsSchema
>;
export type GetCirclesQueryParams = z.infer<typeof getCirclesQueryParams>;
export type FandomWorkTypeBaseEntity = z.infer<typeof fandomWorkTypeBaseEntity>;
export type CircleBlockEntity = z.infer<typeof circleBlockEntity>;
export type CirclePaginationSchema = z.infer<typeof circlePaginationSchema>;
export type OnboardCircleResponse = z.infer<typeof onboardCircleResponse>;
export type GetOneCircleResponse = z.infer<typeof getOneCircleResponse>;
export type GetCirclesResponse = z.infer<typeof getCirclesResponse>;
export type OnboardingPayload = z.infer<typeof onboardingPayload>;
export type EditGeneralInfoFormSchema = z.infer<
  typeof editGeneralInfoFormSchema
>;
export type FandomQueryParams = z.infer<typeof fandomQueryParams>;
export type GetFandomResponse = z.infer<typeof getFandomResponse>;
export type GetAllWorkTypeResponse = z.infer<typeof getAllWorkTypeResponse>;
export type UpdateCirclePayload = z.infer<typeof updateCirclePayload>;
export type CircleFilterWithNoSearch = z.infer<typeof circleFilterWithNoSearch>;
