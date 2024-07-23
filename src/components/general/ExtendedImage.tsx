/* eslint-disable jsx-a11y/alt-text */
import Image from 'next/image';
import React, { ComponentProps, useState } from 'react';

type Props = ComponentProps<typeof Image>;

function ExtendedImage({ onLoad, ...props }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <div className="relative h-full w-full">
      {isLoading && (
        <div className="absolute inset-0 z-[11] flex items-center justify-center gap-1.5 bg-white/50">
          <div className="h-3 w-3 animate-[bounce-higher_1s_infinite] rounded-full bg-primary" />
          <div className="h-3 w-3 animate-[bounce-higher_1s_infinite_100ms] rounded-full bg-[#5E17EB]" />
          <div className="h-3 w-3 animate-[bounce-higher_1s_infinite_250ms] rounded-full bg-red-500" />
        </div>
      )}
      <Image
        onLoad={(e) => {
          setIsLoading(false);
          onLoad?.(e);
        }}
        onError={() => {
          setIsLoading(false);
        }}
        {...props}
      />
    </div>
  );
}

export default ExtendedImage;
