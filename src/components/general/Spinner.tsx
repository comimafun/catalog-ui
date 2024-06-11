import React from 'react';
import { Spinner } from '@nextui-org/react';

function LoadingWrapper({
  children,
  spinning = false,
}: {
  spinning?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {spinning && (
        <div className="absolute inset-0 z-[11] bg-white/50">
          <Spinner className="absolute left-[40%] top-[40%]" />
        </div>
      )}

      {children}
    </div>
  );
}

export default LoadingWrapper;
