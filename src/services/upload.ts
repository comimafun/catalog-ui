import { fetchInstance } from '@/utils/fetch-wrapper';

export const uploadService = {
  uploadImage: async ({
    file,
    type,
  }: {
    file: File;
    type: 'covers' | 'products' | 'circles';
  }) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return fetchInstance(null, '/v1/upload/image', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
