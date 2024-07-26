import CircleCard from '@/components/circle/Card';
import SearchInput from '@/components/circle/Search';
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react';
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
import TVIcon from '@/icons/TVIcon';
import { useSession } from '@/components/providers/SessionProvider';
import { useGetEvents } from '@/hooks/event/useGetEvent';
import { useRouter } from 'next/router';
import XMarkIcon from '@/icons/XMarkIcon';
import { ViewportList } from 'react-viewport-list';
import { useViewport } from '@/components/providers/ViewportProvider';
import CircleHomepageBackToTop from '@/components/general/CircleHomepageBackToTop';

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
  const { viewportRef, listRef } = useViewport();

  const {
    result: data,
    chunked,
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
      <div className="flex flex-col gap-2.5 sm:gap-3">
        <ViewportList
          initialIndex={0}
          initialOffset={0}
          ref={listRef}
          viewportRef={viewportRef}
          items={chunked}
        >
          {(chunk, idx) => {
            return (
              <GridWrapper key={idx}>
                {chunk.map((circle) => {
                  return <CircleCard {...circle} key={circle.id} />;
                })}
              </GridWrapper>
            );
          }}
        </ViewportList>
      </div>

      <GridWrapper>
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

      <div className="mt-4 flex w-full items-center justify-center gap-1.5">
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

        {data.length >= 18 && <CircleHomepageBackToTop />}
      </div>
    </>
  );
};

const Banner = () => {
  return (
    <Link
      href="/referral"
      className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-lg bg-slate-100 ring-1 ring-primary"
    >
      <div className="absolute -left-10 -top-10 h-[120px] w-[120px] rounded-full bg-primary blur-3xl" />
      <div className="absolute -bottom-10 -right-10 h-[120px] w-[120px] rounded-full bg-pink-500 blur-3xl" />

      <div className="relative z-[1] flex items-center justify-center">
        <MegaphoneIcon className="h-20 w-20" />{' '}
        <h2 className="text-center text-xl font-bold sm:text-3xl">
          INVITE AND
          <br />
          GET DISPLAYED
        </h2>
      </div>
    </Link>
  );
};

const WarningDev = () => {
  return (
    <Popover placement="top">
      <PopoverTrigger>
        <button
          type="button"
          className="flex h-6 w-6 items-center justify-center rounded-full bg-warning-200"
        >
          <div className="text-sm font-bold">!</div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="bg-warning-50 px-4 py-2">
        <p className="max-w-[640px] text-xs sm:text-sm">
          Hi, since this is a development version all registered circles will be
          automatically showed up here. So, please don&quot;t put any sensitive
          information. <br />
          Later on it would only show circle with{' '}
          <span className="font-medium">
            <i>publish</i>
          </span>{' '}
          status. <br /> Thank you for your understanding.
        </p>
      </PopoverContent>
    </Popover>
  );
};

const JoinAsCircleCTA = () => {
  const { session } = useSession();
  if (!!session?.circle) return null;

  return (
    <Link
      href={{
        pathname: '/join',
      }}
      className="mt-4 flex min-w-full items-center justify-center gap-1.5 rounded-lg bg-danger py-2 text-center font-bold text-white transition-all hover:bg-primary-50 hover:text-neutral-900 active:scale-90"
    >
      Register your own circle here! <TVIcon className="h-5 w-5" />
    </Link>
  );
};

const EventChipsFilter = () => {
  const { data, error } = useGetEvents(
    { limit: 2, page: 1 },
    { staleTime: Infinity },
  );
  const router = useRouter();
  const { filter } = useParseCircleQueryToParams();
  if (!data || data.length === 0 || error) return null;
  return (
    <ul className="mb-4 mt-0 flex h-full w-full max-w-full items-center gap-2 overflow-x-auto overflow-y-hidden">
      {data.map((ev) => {
        const isSelected = router.query.event === ev.slug;
        return (
          <Link
            className={classNames(
              'whitespace-nowrap border-[1.5px] border-neutral-200 bg-slate-50 px-3 py-1 font-medium text-neutral-500 transition-all active:scale-90',

              isSelected
                ? 'rounded-[50px] border-neutral-500 bg-primary font-semibold text-white'
                : 'rounded-lg hover:bg-slate-200',
            )}
            key={ev.id}
            href={{
              query: {
                ...router.query,
                event: ev.slug,
              },
            }}
            shallow
          >
            <li> {ev.name}</li>
          </Link>
        );
      })}
      {!!router.query.event && (
        <button
          className="rounded-full p-0.5 transition-all delay-200 hover:bg-danger hover:text-white active:scale-90"
          type="button"
          onClick={() => {
            if (!!filter.day) delete router.query.day;
            delete router.query.event;
            router.push(
              {
                query: router.query,
              },
              undefined,
              { shallow: true },
            );
          }}
        >
          <XMarkIcon width={16} height={16} />
        </button>
      )}
    </ul>
  );
};

export default function Home() {
  const setOpen = useDrawerFilterStore((state) => state.setDrawerFilterIsOpen);
  const { isActive } = useParseCircleQueryToParams();
  return (
    <EachPageLayout className="pb-20">
      <Banner />
      <JoinAsCircleCTA />
      <div className="mt-6 flex items-center gap-2">
        <h1 className="text-xl font-bold">Discover Circles</h1>
        <WarningDev />
      </div>
      <div className="mb-4 mt-2 flex w-full items-center gap-2">
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
      <EventChipsFilter />

      <CircleListGrid />
    </EachPageLayout>
  );
}
