import EditFandomWorkTypeSection from '@/components/circle/detail-page/EditFandomWorkTypeSection';
import EditGeneralInfoSection from '@/components/circle/detail-page/EditGeneralInfoSection';
import EachPageLayout from '@/components/general/EachPageLayout';
import LoadingWrapper from '@/components/general/Spinner';
import { useSession } from '@/components/providers/SessionProvider';
import { useGetCircleBySlug } from '@/hooks/circle/useGetCircleBySlug';
import { prettifyError } from '@/utils/helper';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { Fragment, useEffect } from 'react';
import toast from 'react-hot-toast';

const AVAILABLE_STATE = new Set(['general', 'fandom_work_type']);

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
  const { data, isLoading, error } = useGetCircleBySlug();
  const { isLoading: isSessionLoading, session } = useSession();
  const isMyCircle = session?.circle?.id === data?.id;
  useEffect(() => {
    if (!data || isLoading || isSessionLoading || error) return;
    if (!isMyCircle) {
      toast.error('You are not allowed to edit this circle');
      router.replace('/404');
    }
  }, [isMyCircle, isLoading, isSessionLoading, session, error]);
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
    </Fragment>
  );
}

export default CircleEditPage;
