import { PROSE_WYISIWYG_CLASSNAMES } from '@/components/general/Editor';
import {
  useGetCircleBySlug,
  useIsMyCircle,
} from '@/hooks/circle/useGetCircleBySlug';
import EditIcon from '@/icons/EditIcon';
import { classNames } from '@/utils/classNames';
import { Chip } from '@nextui-org/react';
import { sanitize } from 'isomorphic-dompurify';
import Link from 'next/link';
import React from 'react';

function DescriptionSection() {
  const { data } = useGetCircleBySlug();
  const { isAllowed } = useIsMyCircle();

  const descriptionisEmpty =
    !data?.description || (data.description && data.description === '<p></p>');

  if (descriptionisEmpty) {
    return (
      <>
        <div className="flex w-full justify-between">
          <h2 className="text-xl font-semibold">About {data?.name}</h2>

          {isAllowed && (
            <Link
              href={{
                pathname: '/[circleSlug]/edit',
                query: { circleSlug: data?.slug, section: 'description' },
              }}
            >
              <Chip
                color="warning"
                endContent={<EditIcon width={14} height={14} />}
              >
                <span className="font-semibold">Edit</span>
              </Chip>
            </Link>
          )}
        </div>

        {isAllowed ? (
          <p className="mt-2 italic text-neutral-500">
            Tell everyone about your circle!
          </p>
        ) : (
          <p className="mt-2 italic text-neutral-500">
            This circle hasn&apos;t set their description yet.
          </p>
        )}
      </>
    );
  }

  return (
    <>
      <div className="flex w-full justify-between">
        <h2 className="text-xl font-semibold">About {data?.name}</h2>

        {isAllowed && (
          <Link
            href={{
              pathname: '/[circleSlug]/edit',
              query: { circleSlug: data?.slug, section: 'description' },
            }}
          >
            <Chip
              color="warning"
              endContent={<EditIcon width={14} height={14} />}
            >
              <span className="font-semibold">Edit</span>
            </Chip>
          </Link>
        )}
      </div>

      {data.description && (
        <div
          className={classNames(...PROSE_WYISIWYG_CLASSNAMES)}
          dangerouslySetInnerHTML={{
            __html: sanitize(data?.description),
          }}
        />
      )}
    </>
  );
}

export default DescriptionSection;
