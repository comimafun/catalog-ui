/* eslint-disable react/display-name */
import { classNames } from '@/utils/classNames';
import React, { forwardRef } from 'react';

type Props = {
  children: React.ReactNode;
  errorMessage?: string;
  isInvalid?: boolean;
  customRequest?: (file: FileList | null) => void;
} & JSX.IntrinsicElements['input'];

const Uploader = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {
    children,
    className,
    name,
    errorMessage,
    isInvalid = false,
    customRequest,
    onChange,
    ...rest
  } = props;
  return (
    <label
      className={classNames(
        'cursor-pointer space-y-2',
        props.disabled && 'cursor-none',
        className,
      )}
      htmlFor={name}
    >
      {children}
      {!!errorMessage && isInvalid && (
        <p className="text-tiny text-danger">{String(errorMessage)}</p>
      )}
      <input
        type="file"
        className="hidden"
        ref={ref}
        {...rest}
        onChange={(e) => {
          if (customRequest) {
            customRequest(e.target.files);
          } else {
            onChange?.(e);
          }
        }}
        name={name}
        id={name}
      />
    </label>
  );
});

export default Uploader;
