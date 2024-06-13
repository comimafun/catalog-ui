import {
  FandomQueryParams,
  getAllWorkTypeResponse,
  GetCircleQueryParams,
  getCirclesResponse,
  getFandomResponse,
  getOneCircleResponse,
  onboardCircleResponse,
  OnboardingPayload,
} from '@/types/circle';
import { client } from '@/utils/client';

export const circleService = {
  getCircles: async (params: GetCircleQueryParams) => {
    const res = await client('/api/v1/circle', { params: params });
    return getCirclesResponse.parse(res);
  },
  getCircleBySlug: async (slug: string) => {
    const res = await client(`/api/v1/circle/${slug}`);
    return getOneCircleResponse.parse(res);
  },
  postOnboarding: async (payload: OnboardingPayload) => {
    const res = await client('/api/v1/circle/onboard', { body: payload });
    return onboardCircleResponse.parse(res);
  },
  postSaveCircle: (circleId: number) =>
    client(`/api/v1/circle/${circleId}/bookmark`, { method: 'POST' }),
  deleteSaveCircle: (circleId: number) =>
    client(`/api/v1/circle/${circleId}/bookmark`, { method: 'DELETE' }),
  getFandoms: async (params: FandomQueryParams) => {
    const res = await client('/api/v1/fandom', { params: params });
    return getFandomResponse.parse(res);
  },
  getAllWorkTypes: async () => {
    const res = await client('/api/v1/worktype/all');
    return getAllWorkTypeResponse.parse(res);
  },
};
