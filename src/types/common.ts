import { AnyZodObject, z, ZodAny } from 'zod';

export const backendResponseSchema = <T extends AnyZodObject>(zodObj: T) => {
  return z.object({
    code: z.number(),
    data: zodObj,
  });
};
