import CircleBookmarkButton from '@/components/circle/CircleBookmarkButton';
import EachPageLayout from '@/components/general/EachPageLayout';
import { useGetCircleBySlug } from '@/hooks/circle/useGetCircleBySlug';
import LinkIcon from '@/icons/LinkIcon';
import InstagramIcon from '@/icons/socmed/InstagramIcon';
import TwitterIcon from '@/icons/socmed/TwitterIcon';
import { prettifyError } from '@/utils/helper';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next';
import { circleService } from '@/services/circle';

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
  const { data, error } = useGetCircleBySlug();

  if (error) {
    const errMsg = prettifyError(error);
    return (
      <EachPageLayout className="flex items-center justify-center">
        <p>{errMsg}</p>
      </EachPageLayout>
    );
  }

  return (
    <section className="relative w-full border border-neutral-200 bg-white p-4 shadow">
      <CircleBookmarkButton
        bookmarked={data?.bookmarked ?? false}
        id={data?.id ?? 0}
      />
      <div className="flex items-center gap-4">
        <div className="h-28 w-28 rounded-full bg-slate-500"></div>

        <div className="flex flex-col gap-2.5">
          <h1 className="text-2xl font-bold">{data?.name}</h1>
          <ul className="flex gap-1.5">
            {data?.url && (
              <a href={data.url} target="_blank" className="cursor-pointer">
                <li className="flex h-9 w-9 items-center justify-center rounded-full transition-all hover:bg-secondary-50">
                  <LinkIcon width={24} height={24} />
                </li>
              </a>
            )}
            {data?.twitter_url && (
              <a
                href={data.twitter_url}
                target="_blank"
                className="cursor-pointer"
              >
                <li className="flex h-9 w-9 items-center justify-center rounded-full transition-all hover:bg-secondary-50">
                  <TwitterIcon width={24} height={24} />
                </li>
              </a>
            )}

            {data?.instagram_url && (
              <a
                href={data.instagram_url}
                target="_blank"
                className="cursor-pointer"
              >
                <li className="flex h-9 w-9 items-center justify-center rounded-full transition-all hover:bg-secondary-50">
                  <InstagramIcon width={24} height={24} />
                </li>
              </a>
            )}

            {data?.facebook_url && (
              <a
                href={data.facebook_url}
                target="_blank"
                className="cursor-pointer"
              >
                <li className="flex h-9 w-9 items-center justify-center rounded-full transition-all hover:bg-secondary-50">
                  <InstagramIcon width={24} height={24} />
                </li>
              </a>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default CirclePage;
