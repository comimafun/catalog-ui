import EachPageLayout from '@/components/general/EachPageLayout';
import { useGetCircleBySlug } from '@/hooks/circle/useGetCircleBySlug';
import { prettifyError } from '@/utils/helper';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next';
import { circleService } from '@/services/circle';
import SectionPartitionWrapper from '@/components/circle/detail-page/SectionPartitionWrapper';
import GeneralInfoSection from '@/components/circle/detail-page/GeneralInfoSection';

export const getServerSideProps = async (c: GetServerSidePropsContext) => {
  const circleSlug = c.query.circleSlug as string;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['/v1/circle/[slug]', circleSlug],
    queryFn: async () => {
      return (await circleService.getCircleBySlug(c, circleSlug)).data;
    },
  });

  const dehydratedState = dehydrate(queryClient);

  return {
    props: {
      dehydratedState,
    },
  };
};

function CirclePage() {
  const { error } = useGetCircleBySlug();

  if (error) {
    const errMsg = prettifyError(error);
    return (
      <EachPageLayout className="flex items-center justify-center">
        <p>{errMsg}</p>
      </EachPageLayout>
    );
  }

  return (
    <SectionPartitionWrapper>
      <GeneralInfoSection />
    </SectionPartitionWrapper>
  );
}

export default CirclePage;
