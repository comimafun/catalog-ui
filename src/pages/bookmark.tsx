import CirclePaginationSchema from '@/components/circle/Card';
import EachPageLayout from '@/components/general/EachPageLayout';
import { useSession } from '@/components/providers/SessionProvider';
import { useGetBookmarkedCirclesInfinite } from '@/hooks/circle/useGetBookmarkedCirclesInfinite';
import { prettifyError } from '@/utils/helper';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import React from 'react';

const GridWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
      {children}
    </ul>
  );
};

const CircleListGrid = () => {
  const { session, isLoading: isLoadingSession } = useSession();

  const {
    result: data,
    isLoading: isLoadingCircles,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useGetBookmarkedCirclesInfinite({});

  const loading = isLoadingCircles || isFetchingNextPage || isLoadingSession;

  if (!session) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3">
        <p>You need to sign in to see your bookmarked circles</p>
        <Button
          color="primary"
          className="font-semibold"
          as={Link}
          href="/sign-in"
        >
          Sign In
        </Button>
      </div>
    );
  }

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
        <p className="text-base font-semibold">
          You dont have any bookmark yet
        </p>
        <Button color="primary" className="font-semibold" as={Link} href="/">
          Homepage
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

      <div className="mt-4 flex w-full justify-center">
        {hasNextPage && (
          <Button
            type="button"
            color="primary"
            variant="bordered"
            onPress={() => fetchNextPage()}
          >
            Load More
          </Button>
        )}
      </div>
    </>
  );
};

function BookmarkPage() {
  return (
    <EachPageLayout className="pb-20">
      <h1 className="my-6 text-4xl font-bold">Your bookmarked circles 📙</h1>
      <CircleListGrid />
    </EachPageLayout>
  );
}

export default BookmarkPage;
