import {
  GetCircleQueryParams,
  getCirclesResponse,
  onboardCircleResponse,
  OnboardingPayload,
} from '@/types/circle';
import { client } from '@/utils/client';

export const circleService = {
  getCircles: async (params: GetCircleQueryParams) => {
    const res = await client('/api/v1/circle', { params: params });
    return getCirclesResponse.parse(res);
  },
  postOnboarding: async (payload: OnboardingPayload) => {
    const res = await client('/api/v1/circle/onboarding', { body: payload });
    return onboardCircleResponse.parse(res);
  },
};
