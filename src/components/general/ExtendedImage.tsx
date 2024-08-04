/* eslint-disable jsx-a11y/alt-text */
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import QueryString from 'qs';
import React, { ComponentProps, useCallback, useState } from 'react';

type Props = ComponentProps<typeof Image> & {
  manuallyOptimize?: boolean;
};

type GenerateSrcArgs = {
  src: string | StaticImport;
  width?: number | string;
  height?: number | string;
  quality?: number | string;
  fill?: boolean;
};

function ExtendedImage({ onLoad, manuallyOptimize = true, ...props }: Props) {
  const [isLoading, setIsLoading] = useState(true);

  const generateSrc = useCallback(
    ({ src, width, height, quality, fill }: GenerateSrcArgs) => {
      if (!src) return '';
      if (!manuallyOptimize || !!fill) return props.src;

      const BASE_URL = 'https://cdn.innercatalog.com';
      const splitted = props.src.toString().split(BASE_URL);
      const path = splitted[1];
      if (!path) {
        return props.src;
      }

      const NEW_BASE = process.env.NEXT_PUBLIC_UI_BASE_URL! + '/api/image';
      const format: Record<string, number | string> = {};
      if (height) {
        format.height = height;
      }
      if (width) {
        format.width = width;
      }
      if (quality) {
        format.quality = quality;
      }
      format.path = path;
      if (Object.keys(format).length > 0) {
        const q = QueryString.stringify(format);
        return `${NEW_BASE}?${q}`;
      }
      return props.src;
    },
    [],
  );

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
        src={generateSrc({
          src: props.src,
          width: props.width,
          height: props.height,
          quality: props.quality,
          fill: props.fill,
        })}
      />
    </div>
  );
}

export default ExtendedImage;
