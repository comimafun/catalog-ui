import EditCircleCutSection from '@/components/circle/detail-page/EditCircleCutSection';
import EditDescriptionSection from '@/components/circle/detail-page/EditDescriptionSection';
import EditEventSection from '@/components/circle/detail-page/EditEventSection';
import EditFandomWorkTypeSection from '@/components/circle/detail-page/EditFandomWorkTypeSection';
import EditGeneralInfoSection from '@/components/circle/detail-page/EditGeneralInfoSection';
import EditProducts from '@/components/circle/detail-page/EditProducts';
import EachPageLayout from '@/components/general/EachPageLayout';
import Spin from '@/components/general/Spin';
import {
  useGetCircleBySlug,
  useIsMyCircle,
} from '@/hooks/circle/useGetCircleBySlug';
import { prettifyError } from '@/utils/helper';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { Fragment, useEffect } from 'react';
import toast from 'react-hot-toast';

const STATE = [
  'general',
  'fandom_work_type',
  'description',
  'event',
  'circle_cut',
  'product',
] as const;
const AVAILABLE_STATE = new Set(STATE);
type State = (typeof STATE)[number];

const COMPONENTS: Record<State, JSX.Element> = {
  circle_cut: <EditCircleCutSection />,
  description: <EditDescriptionSection />,
  event: <EditEventSection />,
  fandom_work_type: <EditFandomWorkTypeSection />,
  general: <EditGeneralInfoSection />,
  product: <EditProducts />,
};

export const getServerSideProps = async (c: GetServerSidePropsContext) => {
  const { section } = c.query;
  if (!section || !AVAILABLE_STATE.has(section as State)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {},
  };
};

const useProtectRoute = () => {
  const router = useRouter();
  const { state } = useIsMyCircle();
  useEffect(() => {
    if (state === 'loading' || state === 'allowed') return;
    if (state === 'not-allowed') {
      toast.error('You are not allowed to edit this circle');
      router.push(`/${router.query.circleSlug}`);
    }
  }, [state]);
};

function CircleEditPage() {
  const { isLoading, error } = useGetCircleBySlug();
  const router = useRouter();

  useProtectRoute();

  if (error) {
    const errMsg = prettifyError(error);
    return (
      <EachPageLayout className="flex items-center justify-center">
        <p>{errMsg}</p>
      </EachPageLayout>
    );
  }

  if (isLoading) {
    return (
      <Spin spinning>
        <EachPageLayout></EachPageLayout>
      </Spin>
    );
  }

  return (
    <Fragment>
      {!!COMPONENTS[router.query.section as State]
        ? COMPONENTS[router.query.section as State]
        : null}
    </Fragment>
  );
}

export default CircleEditPage;
