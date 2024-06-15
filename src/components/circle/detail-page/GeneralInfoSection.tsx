import React, { useEffect, useState } from 'react';
import CircleBookmarkButton from '../CircleBookmarkButton';
import {
  useGetCircleBySlug,
  useIsMyCircle,
} from '@/hooks/circle/useGetCircleBySlug';
import TwitterIcon from '@/icons/socmed/TwitterIcon';
import InstagramIcon from '@/icons/socmed/InstagramIcon';
import FacebookIcon from '@/icons/socmed/FacebookIcon';
import Link from 'next/link';
import { Chip, Switch } from '@nextui-org/react';
import EditIcon from '@/icons/EditIcon';
import { usePublishMyCircle } from '@/hooks/circle/usePublishMyCircle';
import { prettifyError } from '@/utils/helper';
import toast from 'react-hot-toast';
import LinkIcon from '@/icons/LinkIcon';

const PublishSwitcher = () => {
  const [localPubllished, setLocalPubllished] = useState(false);
  const { data, refetch } = useGetCircleBySlug({
    options: {
      refetchOnMount: true,
    },
  });
  const { mutateAsync, isPending } = usePublishMyCircle();
  const isMyCircle = useIsMyCircle();

  const handlePublishUnpublish = async () => {
    if (!data) return;
    try {
      const savePrevState = localPubllished;
      setLocalPubllished((prev) => !prev);
      await mutateAsync(data.id);
      await refetch();
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

  if (!isMyCircle) return;

  return (
    <Switch
      onClick={handlePublishUnpublish}
      isDisabled={isPending}
      isSelected={localPubllished}
    >
      Publish
    </Switch>
  );
};

function GeneralInfoSection() {
  const { data } = useGetCircleBySlug();
  const isMyCircle = useIsMyCircle();
  const isAnyUrlExist =
    data?.url || data?.twitter_url || data?.instagram_url || data?.facebook_url;
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="min-h-[112px] min-w-[112px] rounded-full bg-slate-500"></div>

        <div className="flex flex-col gap-2.5">
          <h1 className="text-2xl font-bold">{data?.name}</h1>
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
        </div>
      </div>

      {isMyCircle && (
        <div className="flex gap-1.5 self-start">
          <Link
            href={{
              pathname: `/[circleSlug]/edit`,
              query: {
                circleSlug: data?.slug,
                section: 'general',
              },
            }}
          >
            <Chip
              color="warning"
              endContent={<EditIcon width={14} height={14} />}
            >
              <span className="font-semibold">Edit</span>
            </Chip>
          </Link>
          <PublishSwitcher />
        </div>
      )}
    </div>
  );
}

export default GeneralInfoSection;
