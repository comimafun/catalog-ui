import BookIcon from '@/icons/BookIcon';
import { classNames } from '@/utils/classNames';
import Link from 'next/link';
import React, { ComponentProps } from 'react';

const Logo = (props: Omit<ComponentProps<typeof Link>, 'href'>) => {
  return (
    <Link
      href="/"
      className="group relative flex w-min items-center overflow-hidden rounded p-1.5 font-extrabold text-[#5E17EB] ring-1 ring-[#5E17EB] transition-all hover:ring-2"
      scroll
      {...props}
    >
      <div
        className={classNames(
          'absolute rounded-full bg-primary blur transition-all group-hover:bg-pink-500',
          'h-3 w-3 group-hover:h-5 group-hover:w-4',
          '-left-1 -top-1 group-hover:-left-2 group-hover:-top-2',
        )}
      />
      <div
        className={classNames(
          'absolute rounded-full bg-pink-500 blur transition-all group-hover:bg-primary',
          'h-3 w-3 group-hover:h-5 group-hover:w-4',
          '-bottom-1 -right-1 group-hover:-bottom-2 group-hover:-right-2',
        )}
      />
      <span className="relative z-[1] flex items-center justify-center gap-2">
        <BookIcon width={16} height={16} /> <div>innercatalog</div>
      </span>
    </Link>
  );
};

export default Logo;
