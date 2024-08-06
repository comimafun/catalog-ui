import { z } from 'zod';
import { backendResponsePagination, blockString, dayEnum } from './common';

export const eventEntity = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  started_at: z.string(),
  ended_at: z.string(),
  description: z.string().nullable(),
});
export const getEventPaginationSchema = backendResponsePagination(eventEntity);
export const updateAttendingEventPayload = z.object({
  circle_block: blockString.optional(),
  day: dayEnum.or(z.literal('')).nullish(),
  event_id: z.number(),
});

export type EventEntity = z.infer<typeof eventEntity>;
export type GetEventPaginationSchema = z.infer<typeof getEventPaginationSchema>;
export type UpdateAttendingEventPayload = z.infer<
  typeof updateAttendingEventPayload
>;
