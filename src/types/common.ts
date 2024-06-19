import { AnyZodObject, z } from 'zod';

export const backendResponseSchema = <T extends z.ZodTypeAny>(zodObj: T) => {
  return z.object({
    code: z.number(),
    data: zodObj,
  });
};

export const backendResponsePagination = <T extends AnyZodObject>(
  zodObj: T,
) => {
  return z.object({
    code: z.number(),
    data: z.array(zodObj),
    metadata: z.object({
      page: z.number(),
      limit: z.number(),
      total_pages: z.number(),
      total_docs: z.number(),
      has_next_page: z.boolean(),
    }),
  });
};

export const optionalUrl = z.union([
  z.literal(''),
  z.string().trim().url().max(255),
]);

export const trimmedString = z.union([z.literal(''), z.string().trim()]);

export const varchar255 = z
  .string()
  .max(255, { message: 'Too long' })
  .trim()
  .or(z.literal(''));

export type CommonStoreSetter<T extends Record<string, unknown>> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};
