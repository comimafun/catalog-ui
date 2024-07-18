import {
  circlesQueryParamsClient,
  GetCircleQueryParamsClient,
} from '@/types/circle';
import { useRouter } from 'next/router';

export const CIRCLE_FILTER_CLIENT_PARAMS_INITIAL_VALUE: GetCircleQueryParamsClient =
  {
    day: '',
    fandom_id: [],
    work_type_id: [],
    search: '',
  };

export const useParseCircleQueryToParams = () => {
  const router = useRouter();
  const parse = circlesQueryParamsClient.safeParse(router.query);
  let params = CIRCLE_FILTER_CLIENT_PARAMS_INITIAL_VALUE;
  if (parse.success) {
    params = parse.data;
  }

  const isActive = Object.entries(params).some(([key, values]) => {
    return key !== 'search' && values.length > 0;
  });
  return {
    filter: params,
    isActive: isActive,
  };
};
