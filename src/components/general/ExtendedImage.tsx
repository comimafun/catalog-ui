/* eslint-disable jsx-a11y/alt-text */
import Image from 'next/image';
import React, { ComponentProps, useState } from 'react';

type Props = ComponentProps<typeof Image>;

function ExtendedImage({ onLoad, ...props }: Props) {
  const [isLoading, setIsLoading] = useState(true);

  const generateSrc = () => {
    const BASE_URL = 'https://cdn.innercatalog.com';
    const splitted = props.src.toString().split(BASE_URL);
    const path = splitted[1];
    if (!path) {
      return props.src;
    }
    const cfImages = '/cdn-cgi/image';

    const format: string[] = [];

    if (props.height) {
      format.push(`height=${props.height}`);
    }

    if (props.width) {
      format.push(`width=${props.width}`);
    }

    if (props.quality) {
      format.push(`quality=${props.quality}`);
    }

    if (format.length > 0) {
      const optimized = format.join(',');

      return `${BASE_URL}${cfImages}/${optimized}${path}`;
    }

    return props.src;
  };

  return (
    <div className="relative h-full w-full">
      {isLoading && (
        <div className="absolute inset-0 z-[10] flex items-center justify-center gap-1.5 bg-white/50">
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
        unoptimized
        {...props}
        src={generateSrc()}
      />
    </div>
  );
}

export default ExtendedImage;
