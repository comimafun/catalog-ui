import HeartIcon from '@/icons/HeartIcon';
import StopIcon from '@/icons/StopIcon';
import { Circle } from '@/types/circle';
import { classNames } from '@/utils/classNames';
import React, { useState } from 'react';
import { useSession } from '../providers/SessionProvider';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { prettifyError } from '@/utils/helper';
import { useSaveUnsave } from '@/hooks/circle/useSaveUnsave';

const NoImage = () => {
  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-200">
      <StopIcon className="text-neutral-500" width={36} height={36} />
      <p className="font-semibold text-neutral-500">No Image</p>
    </div>
  );
};

const BookmarkButton = ({
  bookmarked,
  id,
}: {
  id: number;
  bookmarked: boolean;
}) => {
  const [localBookmarked, setLocalBookmarked] = useState(bookmarked);
  const router = useRouter();
  const { session } = useSession();
  const { save, unsave, isPending } = useSaveUnsave();
  const handleBookmark = async () => {
    if (!session) {
      toast.error('You need to sign in to bookmark');
      router.push('/sign-in');
      return;
    }

    try {
      if (localBookmarked) {
        await unsave(id);
        setLocalBookmarked(false);
      } else {
        await save(id);
        setLocalBookmarked(true);
      }
    } catch (error) {
      setLocalBookmarked((prev) => !prev);
      toast.error(prettifyError(error as Error));
    }
  };
  return (
    <button
      className="absolute right-4 top-4 active:scale-80"
      type="button"
      onClick={handleBookmark}
      disabled={isPending}
    >
      <HeartIcon
        height={24}
        width={24}
        className={classNames(
          'transition-all delay-200 hover:text-pink-500',
          localBookmarked ? 'text-pink-500' : '',
        )}
        fill={localBookmarked ? 'currentColor' : 'none'}
      />
    </button>
  );
};

function CircleCard(circle: Circle) {
  return (
    <li
      className="flex flex-col overflow-hidden rounded-lg border border-neutral-950 shadow-md"
      key={circle.id}
    >
      <div className="relative flex h-[273px] w-full items-center justify-center">
        <BookmarkButton id={circle.id} bookmarked={circle.bookmarked} />
        <NoImage />
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
    </li>
  );
}

export default CircleCard;
