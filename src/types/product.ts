import { z } from 'zod';
import { backendResponseSchema } from './common';

export const productEntity = z.object({
  id: z.number(),
  name: z.string(),
  image_url: z.string(),
});
export const getProductsResponse = backendResponseSchema(
  z.array(productEntity),
);
export const getOneProductResponse = backendResponseSchema(productEntity);
export const addProductPayoad = productEntity.omit({ id: true });
export const updateProductPayload = productEntity;

export type ProductEntity = z.infer<typeof productEntity>;
export type GetProductsResponse = z.infer<typeof getProductsResponse>;
export type GetOneProductResponse = z.infer<typeof getOneProductResponse>;
export type AddProductPayload = z.infer<typeof addProductPayoad>;
