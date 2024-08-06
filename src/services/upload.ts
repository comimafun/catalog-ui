import { backendResponseSchema } from '@/types/common';
import { fetchInstance } from '@/utils/fetch-wrapper';
import { z } from 'zod';

const uploadResponse = backendResponseSchema(z.string());
export const UPLOAD_TYPES = [
  'covers',
  'products',
  'profiles',
  'descriptions',
] as const;
export const uploadTypes = z.enum(UPLOAD_TYPES);
export type UploadTypes = z.infer<typeof uploadTypes>;
export type UploadPayload = {
  file: File;
  type: UploadTypes;
};

export const uploadService = {
  uploadImage: async ({ file, type }: UploadPayload) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    const res = await fetchInstance(null, '/v1/upload/image', {
      method: 'POST',
      body: formData,
    });
    return uploadResponse.parse(res);
  },
};
