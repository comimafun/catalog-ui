import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSession } from '../providers/SessionProvider';
import { useSaveUnsave } from '@/hooks/circle/useSaveUnsave';
import toast from 'react-hot-toast';
import { prettifyError } from '@/utils/helper';
import HeartIcon from '@/icons/HeartIcon';
import { classNames } from '@/utils/classNames';

function CircleBookmarkButton({
  bookmarked,
  id,
  className,
}: {
  bookmarked: boolean;
  id: number;
  className?: string;
}) {
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
        setLocalBookmarked(false);
        await unsave(id);
      } else {
        setLocalBookmarked(true);
        await save(id);
      }
    } catch (error) {
      setLocalBookmarked((prev) => !prev);
      toast.error(prettifyError(error as Error));
    }
  };

  useEffect(() => {
    if (bookmarked !== localBookmarked) setLocalBookmarked(bookmarked);
  }, [bookmarked]);

  return (
    <button
      className={classNames(
        'group absolute right-4 top-4 active:scale-80',
        className,
      )}
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();

        if (isPending) return;
        handleBookmark();
      }}
      disabled={isPending}
    >
      <HeartIcon
        height={24}
        width={24}
        className={classNames(
          'transition-all delay-200 group-hover:text-pink-500 group-active:scale-80',
          localBookmarked ? 'text-pink-500' : '',
        )}
        fill={localBookmarked ? 'currentColor' : 'none'}
      />
    </button>
  );
}

export default CircleBookmarkButton;
