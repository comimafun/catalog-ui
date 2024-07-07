import {
  useGetCircleBySlug,
  useIsMyCircle,
} from '@/hooks/circle/useGetCircleBySlug';
import EditIcon from '@/icons/EditIcon';
import { Chip } from '@nextui-org/react';
import Link from 'next/link';
import React from 'react';

function FandomWorkTypeSection() {
  const { data } = useGetCircleBySlug();
  const isFandomExist = (data?.fandom ?? []).length > 0;
  const isWorkTypeExist = (data?.work_type ?? []).length > 0;
  const isAnyExist = isFandomExist || isWorkTypeExist;
  const { isAllowed } = useIsMyCircle();

  if (isAllowed && !isAnyExist) {
    return (
      <>
        <div className="flex w-full justify-between">
          <h2 className="text-xl font-semibold">Fandom and Work Type</h2>

          <Link
            href={{
              pathname: '/[circleSlug]/edit',
              query: { circleSlug: data?.slug, section: 'fandom_work_type' },
            }}
          >
            <Chip
              color="warning"
              endContent={<EditIcon width={14} height={14} />}
            >
              <span className="font-semibold">Edit</span>
            </Chip>
          </Link>
        </div>

        <p className="mt-2 italic text-neutral-500">
          Tell everyone which fandom and work type you&apos;re doing!
        </p>
      </>
    );
  }

  if (!isAnyExist) {
    return (
      <>
        <h2 className="text-xl font-semibold">Fandom and Work Type</h2>
        <p className="mt-2 italic text-neutral-500">
          This circle hasn&apos;t set their fandom and work type yet.
        </p>
      </>
    );
  }

  return (
    <>
      {' '}
      <div className="flex w-full justify-between">
        <h2 className="text-xl font-semibold">Fandom and Work Type</h2>

        {isAllowed && (
          <Link
            href={{
              pathname: '/[circleSlug]/edit',
              query: { circleSlug: data?.slug, section: 'fandom_work_type' },
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
      <div className="space-y-2">
        {isFandomExist && (
          <div className="space-y-1">
            <h3 className="font-medium">Fandoms</h3>
            <ul className="flex flex-wrap gap-1">
              {data?.fandom.map((fandom) => {
                return (
                  <Chip color="secondary" key={fandom.id}>
                    <span className="text-xs font-medium">{fandom.name}</span>
                  </Chip>
                );
              })}
            </ul>
          </div>
        )}

        {isWorkTypeExist && (
          <div className="space-y-1">
            <h3 className="font-medium">Work Types</h3>
            <ul className="flex flex-wrap gap-1">
              {data?.work_type.map((type) => {
                return (
                  <Chip color="primary" key={type.id}>
                    <span className="text-xs font-medium">{type.name}</span>
                  </Chip>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default FandomWorkTypeSection;
