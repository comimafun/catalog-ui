import StopIcon from '@/icons/StopIcon';
import type { CircleCard } from '@/types/circle';
import Link from 'next/link';
import CircleBookmarkButton from './CircleBookmarkButton';
import ExtendedImage from '../general/ExtendedImage';

const NoImage = () => {
  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-200">
      <StopIcon className="text-neutral-500" width={36} height={36} />
      <p className="font-semibold text-neutral-500">No Image</p>
    </div>
  );
};

function CircleCard(circle: CircleCard) {
  return (
    <li className="flex flex-col overflow-hidden rounded-lg border border-neutral-950 shadow-md">
      <Link
        href={{
          pathname: '/[circleSlug]',
          query: { circleSlug: circle.slug },
        }}
        shallow
        className="flex h-full w-full flex-col"
      >
        <div className="relative flex aspect-[7/10] min-h-[262px] w-full items-center justify-center overflow-hidden border-b border-neutral-900 md:min-h-[273px]">
          <CircleBookmarkButton id={circle.id} bookmarked={circle.bookmarked} />
          {circle.cover_picture_url ? (
            <ExtendedImage
              height={273}
              width={192}
              src={circle.cover_picture_url}
              alt={`Circle cut of ` + circle.name}
              quality={60}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <NoImage />
          )}
        </div>
        <div className="h-full w-full space-y-1.5 p-2 font-medium">
          <p className="break-all text-base font-semibold">{circle.name}</p>
          {!!circle.rating && (
            <div className="text-xs">Rated: {circle.rating}</div>
          )}
          {circle.fandom.length > 0 && (
            <p className="text-xs">
              Fandom: {circle.fandom.map((x) => x.name).join(', ')}
            </p>
          )}

          {circle.work_type.length > 0 && (
            <p className="text-xs">
              Work Type: {circle.work_type.map((x) => x.name).join(', ')}
            </p>
          )}

          {!!circle.event && (
            <>
              <p className="text-xs">Convention: {circle.event.name}</p>
              {!!circle.day && (
                <p className="text-xs">
                  Day: <span className="capitalize">{circle.day}</span> day(s)
                </p>
              )}
            </>
          )}
        </div>
      </Link>
    </li>
  );
}

export default CircleCard;
