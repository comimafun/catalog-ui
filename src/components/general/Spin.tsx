import React from 'react';
import { Spinner } from '@nextui-org/react';
import { classNames } from '@/utils/classNames';

function Spin({
  children,
  spinning = false,
  className,
  indicatorLoading,
}: {
  spinning?: boolean;
  children: React.ReactNode;
  className?: string;
  indicatorLoading?: React.ReactNode;
}) {
  return (
    <div className="relative min-h-full min-w-full">
      {spinning && (
        <div
          className={classNames(
            'absolute inset-0 z-[11] flex items-center justify-center bg-white/50',
            className,
          )}
        >
          {indicatorLoading || <Spinner />}
        </div>
      )}

      {children}
    </div>
  );
}

export default Spin;
