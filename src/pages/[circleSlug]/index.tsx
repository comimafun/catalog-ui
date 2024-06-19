import EachPageLayout from '@/components/general/EachPageLayout';
import { useGetCircleBySlug } from '@/hooks/circle/useGetCircleBySlug';
import { prettifyError } from '@/utils/helper';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next';
import { circleService } from '@/services/circle';
import SectionPartitionWrapper from '@/components/circle/detail-page/SectionPartitionWrapper';
import GeneralInfoSection from '@/components/circle/detail-page/GeneralInfoSection';
import FandomWorkTypeSection from '@/components/circle/detail-page/FandomWorkTypeSection';
import DescriptionSection from '@/components/circle/detail-page/DescriptionSection';
import EventSection from '@/components/circle/detail-page/EventSection';

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
  const { error } = useGetCircleBySlug({ options: { refetchOnMount: true } });

  if (error) {
    const errMsg = prettifyError(error);
    return (
      <EachPageLayout className="flex items-center justify-center">
        <p>{errMsg}</p>
      </EachPageLayout>
    );
  }

  return (
    <div className="space-y-4">
      <SectionPartitionWrapper>
        <GeneralInfoSection />
      </SectionPartitionWrapper>
      <SectionPartitionWrapper>
        <EventSection />
      </SectionPartitionWrapper>
      <SectionPartitionWrapper>
        <FandomWorkTypeSection />
      </SectionPartitionWrapper>
      <SectionPartitionWrapper>
        <DescriptionSection />
      </SectionPartitionWrapper>
    </div>
  );
}

export default CirclePage;
