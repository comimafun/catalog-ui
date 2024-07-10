import { classNames } from '@/utils/classNames';
import React from 'react';

function EachPageLayout({
  children,
  className,
  ...props
}: JSX.IntrinsicElements['main']) {
  return (
    <main
      className={classNames(
        'min-h-[calc(100vh-63px-141px)] w-full bg-white px-4 pt-4',
        className,
      )}
      {...props}
    >
      {children}
    </main>
  );
}

export default EachPageLayout;
