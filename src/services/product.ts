import {
  AddProductPayload,
  getOneProductResponse,
  getProductsResponse,
  ProductEntity,
} from '@/types/product';
import { fetchInstance } from '@/utils/fetch-wrapper';

export const productService = {
  getProductsByCircleID: async (circleID: number) => {
    const res = await fetchInstance(null, `/v1/circle/${circleID}/product`);
    return getProductsResponse.parse(res);
  },
  postAddProductByCircleID: async (
    circleID: number,
    payload: AddProductPayload,
  ) => {
    const res = await fetchInstance(null, `/v1/circle/${circleID}/product`, {
      body: payload,
      method: 'POST',
    });
    return getOneProductResponse.parse(res);
  },
  deleteOneProductByCircleIDProductID: async ({
    circleID,
    productID,
  }: {
    circleID: number;
    productID: number;
  }) => {
    return fetchInstance(null, `/v1/circle/${circleID}/product/${productID}`, {
      method: 'DELETE',
    });
  },
  putUpdateOneProductByCircleIDProductID: async ({
    circleID,
    payload,
  }: {
    circleID: number;
    payload: ProductEntity;
  }) => {
    const res = await fetchInstance(
      null,
      `/v1/circle/${circleID}/product/${payload.id}`,
      {
        body: payload,
        method: 'PUT',
      },
    );
    return getOneProductResponse.parse(res);
  },
};
