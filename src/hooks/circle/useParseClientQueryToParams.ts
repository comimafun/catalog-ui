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
  if (parse.success) {
    return parse.data;
  }
  return CIRCLE_FILTER_CLIENT_PARAMS_INITIAL_VALUE;
};
