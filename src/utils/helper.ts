import { ZodError } from 'zod';
import nookies from 'nookies';
import { parseError } from './fetch-wrapper';
import { Image, ResizeOptions } from 'image-js';

export const prettifyError = (error: Error | null) => {
  console.error(error);
  if (error instanceof ZodError) {
    const fields = Object.entries(error.flatten().fieldErrors).map(
      ([field, err]) => {
        const message = err ? err.join(', ') : 'SCHEMA_ERROR';
        return `${field}: ${message}}`;
      },
    );
    return fields.join(' | ');
  }

  const apiError = parseError(error);
  if (apiError) {
    return `${apiError.code} ${apiError.error} (${apiError.error_id})`;
  }

  if (error?.message) {
    return error.message;
  }

  return 'Something went wrong, please contact support.';
};

export const setAccessToken = (accessToken: string, _expires: string) => {
  nookies.set(null, 'access_token', accessToken, {
    // expires: new Date(expires),
    path: '/',
  });
};

export const downSizeForCoverImage = async (
  file: File,
  resizeOptions?: ResizeOptions,
  quality?: number,
) => {
  const buffer = await file.arrayBuffer();
  const image = await Image.load(buffer);
  const resizedBlob = await image
    .resize({
      preserveAspectRatio: true,
      interpolation: 'nearestNeighbor',
      ...resizeOptions,
    })
    .toBlob(file.type, quality ?? 0.75);

  return new File([resizedBlob], file.name, {
    type: file.type,
    lastModified: Date.now(),
  });
};

function slice<T>(array: Array<T>, start: number, end: number) {
  let length = array == null ? 0 : array.length;
  if (!length) {
    return [];
  }
  start = start == null ? 0 : start;
  end = end === undefined ? length : end;

  if (start < 0) {
    start = -start > length ? 0 : length + start;
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : (end - start) >>> 0;
  start >>>= 0;

  let index = -1;
  const result = new Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

export function chunk<T>(array: Array<T>, size = 1) {
  size = Math.max(size, 0);
  const length = array == null ? 0 : array.length;
  if (!length || size < 1) {
    return [];
  }
  let index = 0;
  let resIndex = 0;
  const result = new Array(Math.ceil(length / size));

  while (index < length) {
    result[resIndex++] = slice(array, index, (index += size));
  }
  return result as Array<Array<T>>;
}
