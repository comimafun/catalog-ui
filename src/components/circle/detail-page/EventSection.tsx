import {
  useGetCircleBySlug,
  useIsMyCircle,
} from '@/hooks/circle/useGetCircleBySlug';
import { time } from '@/utils/time';
import Link from 'next/link';
import EditButton from './EditButton';

const Header = () => {
  const { data } = useGetCircleBySlug();
  const { isAllowed } = useIsMyCircle();

  return (
    <>
      <div className="flex w-full justify-between">
        <h2 className="text-xl font-semibold">Attending Convention</h2>

        {isAllowed && (
          <Link
            href={{
              pathname: '/[circleSlug]/edit',
              query: { circleSlug: data?.slug, section: 'event' },
            }}
          >
            <EditButton />
          </Link>
        )}
      </div>
    </>
  );
};

function EventSection() {
  const { data } = useGetCircleBySlug();
  const { isNotAllowed, isAllowed } = useIsMyCircle();

  return (
    <>
      <Header />
      {!data?.event && isAllowed && (
        <p className="mt-2 italic text-neutral-500">
          Set your next convention!
        </p>
      )}

      {!data?.event && isNotAllowed && (
        <p className="mt-2 italic text-neutral-500">
          This circle hasn&apos;t set their event yet.
        </p>
      )}

      {!!data?.event && (
        <div className="flex w-full flex-col gap-y-1">
          <h3 className="text-base font-semibold">{data.event.name}</h3>
          <ul className="flex flex-col gap-y-1">
            {' '}
            <li>
              Time:{' '}
              {time(data.event.started_at).format('dddd, DD MMM YYYY HH:mm')} -{' '}
              {time(data.event.ended_at).format('dddd, DD MMM YYYY HH:mm')}
            </li>
            <li>Day: {data.day ? `${data.day.toUpperCase()} day` : 'TBA'}</li>
            <li>Block: {data?.block?.name ?? 'TBA'}</li>
          </ul>
        </div>
      )}
    </>
  );
}

export default EventSection;
