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

const FilterDrawer = dynamic(() => import('@/components/circle/FilterDrawer'), {
  ssr: false,
});

const GridWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <ul className="grid gap-3 xs:grid-cols-2 sm:grid-cols-3">{children}</ul>
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
  } = useGetCirclesInfinite(params);

  if (error) {
    const err = prettifyError(error);

    return (
      <div className="flex h-full w-full items-center justify-center">
        <p>{err}</p>
      </div>
    );
  }

  return (
    <>
      <GridWrapper>
        {data?.map((circle) => {
          return <CircleCard {...circle} key={circle.id} />;
        })}

        {(isLoading || isFetchingNextPage) &&
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

export default function Home() {
  const setOpen = useDrawerFilterStore((state) => state.setDrawerFilterIsOpen);
  return (
    <EachPageLayout className="pb-20">
      <div className="h-48 w-full rounded-lg bg-slate-400"></div>
      <div className="my-6 flex w-full items-center gap-2">
        <SearchInput />
        <button
          type="button"
          className="flex h-[36px] items-center justify-center rounded-medium border-medium border-default-200 bg-white px-4 transition-all active:scale-90"
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
