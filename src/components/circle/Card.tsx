import StopIcon from '@/icons/StopIcon';
import type { CircleCard } from '@/types/circle';
import Link from 'next/link';
import CircleBookmarkButton from './CircleBookmarkButton';
import Image from 'next/image';

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
      >
        <div className="relative flex h-[273px] w-full items-center justify-center overflow-hidden border-b border-neutral-900">
          <CircleBookmarkButton id={circle.id} bookmarked={circle.bookmarked} />
          {circle.cover_picture_url ? (
            <Image
              height={273}
              width={192}
              src={circle.cover_picture_url}
              alt={`Circle cut of` + circle.name}
              quality={60}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <NoImage />
          )}
        </div>
        <div className="w-full space-y-1.5 p-2 font-medium">
          <p className="break-all text-base font-semibold">{circle.name}</p>
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

          <p className="text-xs">Day: {circle.day ?? 'TBA'}</p>
        </div>
      </Link>
    </li>
  );
}

export default CircleCard;
