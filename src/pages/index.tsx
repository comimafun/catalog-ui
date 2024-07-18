import CircleCard from '@/components/circle/Card';
import SearchInput from '@/components/circle/Search';
import { Button } from '@nextui-org/react';
import { prettifyError } from '@/utils/helper';
import { useGetCirclesInfinite } from '@/hooks/circle/useGetCirclesInfinite';
import { useParseCircleQueryToParams } from '@/hooks/circle/useParseClientQueryToParams';
import FilterIcon from '@/icons/FilterIcon';
import { useDrawerFilterStore } from '@/store/circle';
import dynamic from 'next/dynamic';
import EachPageLayout from '@/components/general/EachPageLayout';
import Link from 'next/link';
import MegaphoneIcon from '@/icons/MegaphoneIcon';
import { classNames } from '@/utils/classNames';

const FilterDrawer = dynamic(() => import('@/components/circle/FilterDrawer'), {
  ssr: false,
});

const GridWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
      {children}
    </ul>
  );
};

const CircleListGrid = () => {
  const params = useParseCircleQueryToParams();

  const {
    result: data,
    isLoading,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useGetCirclesInfinite(params.filter);

  const loading = isLoading || isFetchingNextPage;

  if (error) {
    const err = prettifyError(error);

    return (
      <div className="flex h-full w-full items-center justify-center">
        <p>{err}</p>
      </div>
    );
  }

  if (data.length === 0 && !loading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3">
        <p className="text-base font-semibold">Sorry, no circle yet</p>
        <p>Sign up yours?🥹</p>
        <Button
          color="primary"
          className="font-semibold"
          as={Link}
          href="/join"
        >
          Join
        </Button>
      </div>
    );
  }

  return (
    <>
      <GridWrapper>
        {data?.map((circle) => {
          return <CircleCard {...circle} key={circle.id} />;
        })}

        {loading &&
          new Array(12).fill(0).map((_, index) => {
            return (
              <li
                className="h-[380px] w-full animate-pulse-faster rounded-lg bg-slate-400"
                key={index}
              ></li>
            );
          })}
      </GridWrapper>

      {hasNextPage && (
        <Button
          type="button"
          color="primary"
          variant="shadow"
          onPress={() => fetchNextPage()}
        >
          Load More
        </Button>
      )}
    </>
  );
};

const Banner = () => {
  return (
    <Link
      href="/"
      className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-lg bg-slate-100 ring-1 ring-primary"
    >
      <div className="absolute -left-10 -top-10 h-[120px] w-[120px] rounded-full bg-primary blur-3xl" />
      <div className="absolute -bottom-10 -right-10 h-[120px] w-[120px] rounded-full bg-pink-500 blur-3xl" />

      <div className="relative z-[1] flex items-center justify-center">
        <MegaphoneIcon className="h-20 w-20" />{' '}
        <h2 className="text-xl font-bold sm:text-3xl">
          PUT YOUR CIRCLE HERE
          <br />
          FOR FREE
        </h2>
      </div>
    </Link>
  );
};

export default function Home() {
  const setOpen = useDrawerFilterStore((state) => state.setDrawerFilterIsOpen);
  const { isActive } = useParseCircleQueryToParams();
  return (
    <EachPageLayout className="pb-20">
      <Banner />
      <div className="my-6 flex w-full items-center gap-2">
        <SearchInput />
        <button
          type="button"
          className={classNames(
            'flex h-10 items-center justify-center rounded-medium border-medium bg-white px-4 transition-all active:scale-90',
            isActive
              ? 'border-white bg-primary text-white'
              : '!border-default-200',
          )}
          onClick={() => setOpen(true)}
        >
          <FilterIcon width={16} height={16} />
        </button>
        <FilterDrawer />
      </div>
      <CircleListGrid />
    </EachPageLayout>
  );
}
