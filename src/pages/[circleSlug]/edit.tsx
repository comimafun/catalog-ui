import EditDescriptionSection from '@/components/circle/detail-page/EditDescriptionSection';
import EditEventSection from '@/components/circle/detail-page/EditEventSection';
import EditFandomWorkTypeSection from '@/components/circle/detail-page/EditFandomWorkTypeSection';
import EditGeneralInfoSection from '@/components/circle/detail-page/EditGeneralInfoSection';
import EachPageLayout from '@/components/general/EachPageLayout';
import LoadingWrapper from '@/components/general/Spinner';
import { useSession } from '@/components/providers/SessionProvider';
import {
  useGetCircleBySlug,
  useIsMyCircle,
} from '@/hooks/circle/useGetCircleBySlug';
import { prettifyError } from '@/utils/helper';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { Fragment, useEffect } from 'react';
import toast from 'react-hot-toast';

const AVAILABLE_STATE = new Set([
  'general',
  'fandom_work_type',
  'description',
  'event',
]);

export const getServerSideProps = async (c: GetServerSidePropsContext) => {
  const { section } = c.query;
  if (!section || !AVAILABLE_STATE.has(section as string)) {
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
      <LoadingWrapper spinning>
        <EachPageLayout></EachPageLayout>
      </LoadingWrapper>
    );
  }

  return (
    <Fragment>
      {router.query.section === 'general' && <EditGeneralInfoSection />}
      {router.query.section === 'fandom_work_type' && (
        <EditFandomWorkTypeSection />
      )}

      {router.query.section === 'description' && <EditDescriptionSection />}
      {router.query.section === 'event' && <EditEventSection />}
    </Fragment>
  );
}

export default CircleEditPage;
