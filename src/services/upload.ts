import { backendResponseSchema } from '@/types/common';
import { fetchInstance } from '@/utils/fetch-wrapper';
import { z } from 'zod';

const uploadResponse = backendResponseSchema(z.string());

export const uploadService = {
  uploadImage: async ({
    file,
    type,
  }: {
    file: File;
    type: 'covers' | 'products' | 'profiles' | 'descriptions';
  }) => {
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
