/* eslint-disable jsx-a11y/alt-text */
import Image from 'next/image';
import React, { ComponentProps, useState } from 'react';
import Spin from './Spin';

type Props = ComponentProps<typeof Image>;

function ExtendedImage({ onLoad, ...props }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <Spin spinning={isLoading}>
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
    </Spin>
  );
}

export default ExtendedImage;
