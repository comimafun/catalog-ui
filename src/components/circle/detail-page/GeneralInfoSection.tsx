import { useEffect, useState } from 'react';
import CircleBookmarkButton from '../CircleBookmarkButton';
import {
  getCircleBySlugOptions,
  useGetCircleBySlug,
  useIsMyCircle,
} from '@/hooks/circle/useGetCircleBySlug';
import TwitterIcon from '@/icons/socmed/TwitterIcon';
import InstagramIcon from '@/icons/socmed/InstagramIcon';
import FacebookIcon from '@/icons/socmed/FacebookIcon';
import Link from 'next/link';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Switch,
} from '@nextui-org/react';
import { usePublishMyCircle } from '@/hooks/circle/usePublishMyCircle';
import { prettifyError } from '@/utils/helper';
import toast from 'react-hot-toast';
import LinkIcon from '@/icons/LinkIcon';
import ExtendedImage from '@/components/general/ExtendedImage';
import EditButton from './EditButton';
import { RATING_METADATA } from '@/constants/common';
import { useQueryClient } from '@tanstack/react-query';

const PublishSwitcher = () => {
  const { data } = useGetCircleBySlug();
  const [localPubllished, setLocalPubllished] = useState(
    data?.published ?? false,
  );
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = usePublishMyCircle();
  const { isNotAllowed } = useIsMyCircle();

  const handlePublishUnpublish = async () => {
    if (!data) return;
    try {
      const savePrevState = localPubllished;
      if (!savePrevState) {
        if (
          !data.fandom?.length ||
          !data.work_type?.length ||
          !data.cover_picture_url
        ) {
          toast.error(
            'Fandom, work types, and circle cut is required for publishing!',
          );
          return;
        }
      }

      setLocalPubllished((prev) => !prev);
      await mutateAsync(data.id);
      await queryClient.invalidateQueries({
        queryKey: getCircleBySlugOptions(null, data.slug, {}).queryKey,
      });
      if (savePrevState) {
        toast.success('Circle unpublished!');
      } else {
        toast.success('Circle published!');
      }
    } catch (error) {
      setLocalPubllished((prev) => !prev);
      toast.error(prettifyError(error as Error));
    }
  };

  useEffect(() => {
    if (!data?.published) return;
    if (data.published !== localPubllished) {
      setLocalPubllished(data?.published);
    }
  }, [data?.published]);

  if (isNotAllowed) return;

  return (
    <div className="flex items-center gap-2 rounded-lg border border-warning bg-slate-50 px-2 py-1">
      <span className="text-xs font-semibold">Publish</span>
      <Switch
        onClick={handlePublishUnpublish}
        isDisabled={isPending}
        isSelected={localPubllished}
        color="warning"
        size="sm"
      >
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
              Fandom, work types, and circle cut is required for publishing!
            </p>
          </PopoverContent>
        </Popover>
      </Switch>
    </div>
  );
};

function GeneralInfoSection() {
  const { data } = useGetCircleBySlug();
  const { isAllowed } = useIsMyCircle();
  const isAnyUrlExist =
    data?.url || data?.twitter_url || data?.instagram_url || data?.facebook_url;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        {data?.picture_url ? (
          <div className="h-16 min-h-16 w-16 min-w-16 overflow-hidden rounded-full border border-neutral-100 shadow-lg sm:min-h-[112px] sm:min-w-[112px]">
            <ExtendedImage
              width={112}
              height={112}
              src={data?.picture_url}
              alt={`Picture of ` + data?.name}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="min-h-[112px] min-w-[112px] rounded-full bg-slate-500"></div>
        )}

        <div className="flex flex-col gap-1.5">
          <h1 className="text-xl font-bold sm:text-2xl">{data?.name}</h1>
          <ul className="flex gap-1.5">
            <div className="flex">
              <CircleBookmarkButton
                bookmarked={data?.bookmarked ?? false}
                id={data?.id ?? 0}
                className="relative inset-0"
              />{' '}
              {isAnyUrlExist && (
                <div className="ml-1.5 mr-0 h-full w-[1px] bg-neutral-950" />
              )}
            </div>

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
                  <FacebookIcon width={24} height={24} />
                </li>
              </a>
            )}
          </ul>
          {!!data?.rating && (
            <div className="font-medium">
              Rating: {RATING_METADATA[data.rating]}
            </div>
          )}
        </div>
      </div>

      {isAllowed && (
        <div className="ml-auto flex items-end gap-1.5 self-start">
          <PublishSwitcher />
          <Link
            href={{
              pathname: `/[circleSlug]/edit`,
              query: {
                circleSlug: data?.slug,
                section: 'general',
              },
            }}
          >
            <EditButton />
          </Link>
        </div>
      )}
    </div>
  );
}

export default GeneralInfoSection;
