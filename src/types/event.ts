import { z } from 'zod';
import { backendResponsePagination } from './common';

export const eventEntity = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  started_at: z.string(),
  ended_at: z.string(),
  description: z.string().nullable(),
});

export const getEventPaginationSchema = backendResponsePagination(eventEntity);
