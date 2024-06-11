import clsx from 'clsx';
import { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const classNames = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export { classNames };
