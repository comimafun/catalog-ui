import { classNames } from '@/utils/classNames';
import React from 'react';

function SectionPartitionWrapper({
  children,
  className,

  ...props
}: JSX.IntrinsicElements['section']) {
  return (
    <section
      className={classNames(
        'relative w-full border border-neutral-200 bg-white p-4 shadow sm:p-4',
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export default SectionPartitionWrapper;
