import {
  fandomWorkTypeBaseEntity,
  getAllWorkTypeResponse,
  getCirclesResponse,
  getFandomResponse,
  getOneCircleResponse,
  getProductResponse,
  onboardCircleResponse,
  productEntity,
  type FandomQueryParams,
  type GetCircleQueryParams,
  type OnboardingPayload,
  type UpdateCirclePayload,
} from '@/types/circle';
import { backendResponseSchema } from '@/types/common';
import { FetchContext, fetchInstance } from '@/utils/fetch-wrapper';

export const circleService = {
  getCircles: async (params: GetCircleQueryParams) => {
    const res = await fetchInstance(null, '/v1/circle', { params: params });
    return getCirclesResponse.parse(res);
  },
  getCircleBySlug: async (c: FetchContext, slug: string) => {
    const res = await fetchInstance(c, `/v1/circle/${slug}`);
    return getOneCircleResponse.parse(res);
  },
  publishUnpublishMyCircle: (circleID: number) =>
    fetchInstance(null, `/v1/circle/${circleID}/publish`, { method: 'POST' }),
  patchUpdateCircleByID: async (
    circleID: number,
    payload: UpdateCirclePayload,
  ) => {
    const res = await fetchInstance(null, `/v1/circle/${circleID}`, {
      body: payload,
      method: 'PATCH',
    });
    return getOneCircleResponse.parse(res);
  },
  postOnboarding: async (payload: OnboardingPayload) => {
    const res = await fetchInstance(null, '/v1/circle/onboard', {
      body: payload,
    });
    return onboardCircleResponse.parse(res);
  },
  postSaveCircle: (circleId: number) =>
    fetchInstance(null, `/v1/circle/${circleId}/bookmark`, {
      method: 'POST',
    }),
  deleteSaveCircle: (circleId: number) =>
    fetchInstance(null, `/v1/circle/${circleId}/bookmark`, {
      method: 'DELETE',
    }),
  postCreateFandom: async (name: string) => {
    const res = await fetchInstance(null, '/v1/fandom', {
      body: {
        name,
      },
    });
    return backendResponseSchema(fandomWorkTypeBaseEntity).parse(res);
  },
  getFandoms: async (params: FandomQueryParams) => {
    const res = await fetchInstance(null, '/v1/fandom', { params: params });
    return getFandomResponse.parse(res);
  },
  getAllWorkTypes: async () => {
    const res = await fetchInstance(null, '/v1/worktype/all');
    return getAllWorkTypeResponse.parse(res);
  },
  getProductsByCircleID: async (circleID: number) => {
    const res = await fetchInstance(null, `/v1/circle/${circleID}/product`);
    return getProductResponse.parse(res);
  },
};
