import EachPageLayout from '@/components/general/EachPageLayout';
import {
  getCircleBySlugOptions,
  useGetCircleBySlug,
} from '@/hooks/circle/useGetCircleBySlug';
import { prettifyError } from '@/utils/helper';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next';
import SectionPartitionWrapper from '@/components/circle/detail-page/SectionPartitionWrapper';
import GeneralInfoSection from '@/components/circle/detail-page/GeneralInfoSection';
import FandomWorkTypeSection from '@/components/circle/detail-page/FandomWorkTypeSection';
import DescriptionSection from '@/components/circle/detail-page/DescriptionSection';
import EventSection from '@/components/circle/detail-page/EventSection';
import CircleCutSection from '@/components/circle/detail-page/CircleCutSection';
import ProductSection from '@/components/circle/detail-page/ProductSection';

export const getServerSideProps = async (c: GetServerSidePropsContext) => {
  const circleSlug = c.query.circleSlug as string;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    getCircleBySlugOptions(c, circleSlug, { retry: 0 }),
  );

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
    <div className="min-h-[calc(100vh-63px-141px)] space-y-4">
      <SectionPartitionWrapper>
        <GeneralInfoSection />
      </SectionPartitionWrapper>
      <CircleCutSection />
      <SectionPartitionWrapper>
        <EventSection />
      </SectionPartitionWrapper>
      <SectionPartitionWrapper>
        <FandomWorkTypeSection />
      </SectionPartitionWrapper>
      <SectionPartitionWrapper>
        <ProductSection />
      </SectionPartitionWrapper>
      <SectionPartitionWrapper>
        <DescriptionSection />
      </SectionPartitionWrapper>
    </div>
  );
}

export default CirclePage;
