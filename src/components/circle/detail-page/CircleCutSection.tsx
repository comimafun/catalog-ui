import {
  useGetCircleBySlug,
  useIsMyCircle,
} from '@/hooks/circle/useGetCircleBySlug';
import { Accordion, AccordionItem, Button } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function CircleCutSection() {
  const { data } = useGetCircleBySlug();
  const { isAllowed } = useIsMyCircle();

  return (
    <Accordion className="px-0">
      <AccordionItem
        classNames={{
          base: 'relative w-full border border-neutral-200 bg-white shadow px-4',
        }}
        title={<h2 className="text-xl font-semibold">Circle Cut</h2>}
      >
        <div className="flex flex-col items-center justify-center gap-4">
          {data?.cover_picture_url ? (
            <div className="flex aspect-[7/10] w-auto items-center justify-center overflow-hidden rounded-lg border border-neutral-100 shadow-lg md:h-[500px]">
              <Image
                width={140}
                height={200}
                src={data.cover_picture_url}
                alt={`Circle cut of` + data?.name}
                className="h-full w-full rounded-lg object-cover"
                loading="lazy"
                quality={100}
              />
            </div>
          ) : (
            <p className="mt-2 italic text-neutral-500">
              {isAllowed ? 'Set your circle cut!' : 'No circle cut yet!'}
            </p>
          )}

          {isAllowed && (
            <Button
              as={Link}
              href={`/${data?.slug}/edit?section=circle_cut`}
              color="warning"
              className="font-semibold"
            >
              {data?.cover_picture_url ? 'Change' : 'Upload'} your circle cut
            </Button>
          )}
        </div>
      </AccordionItem>
    </Accordion>
  );
}

export default CircleCutSection;
