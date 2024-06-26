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
      width: 300,
      interpolation: 'nearestNeighbor',
      ...resizeOptions,
    })
    .toBlob(file.type, quality ?? 0.75);

  return new File([resizedBlob], file.name, {
    type: file.type,
    lastModified: Date.now(),
  });
};
