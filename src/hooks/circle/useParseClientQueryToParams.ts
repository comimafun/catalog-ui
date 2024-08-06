import {
  circleRouterQueryParamsSchema,
  CircleRouterQueryParamsSchema,
} from '@/types/circle';
import { useRouter } from 'next/router';

export const CIRCLE_FILTER_CLIENT_PARAMS_INITIAL_VALUE: CircleRouterQueryParamsSchema =
  {
    day: '',
    fandom_id: [],
    work_type_id: [],
    search: '',
    rating: [],
    event: '',
  };

export const useParseCircleQueryToParams = () => {
  const router = useRouter();
  const parse = circleRouterQueryParamsSchema.safeParse(router.query);
  let params = CIRCLE_FILTER_CLIENT_PARAMS_INITIAL_VALUE;
  if (parse.success) {
    params = parse.data;
  }

  const isActive = Object.entries(params).some(([key, values]) => {
    return key !== 'search' && key !== 'event' && values.length > 0;
  });
  return {
    filter: params,
    isActive: isActive,
  };
};
