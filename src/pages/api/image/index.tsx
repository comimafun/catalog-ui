import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';

const imageOptimizationDto = z.object({
  path: z.string(),
  width: z.string().transform((v) => Number(v)),
  height: z.string().transform((v) => Number(v)),
  quality: z
    .string()
    .transform((v) => Number(v))
    .optional()
    .default('80'),
});

type ImageOptimizationDto = z.infer<typeof imageOptimizationDto>;

const S3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.ACCOUNT_KEY_ID!,
    secretAccessKey: process.env.ACCOUNT_KEY_SECRET!,
  },
});

const generateKey = (dto: ImageOptimizationDto) => {
  const cacheKey = 'cache';
  const width = 'width=' + dto.width;
  const height = 'height=' + dto.height;
  const quality = 'quality=' + dto.quality;
  const formats = [width, height, quality];
  const join = formats.join(',');
  return cacheKey + '/' + join + dto.path;
};

const imageExist = async (cacheKey: string) => {
  const cdnURL = process.env.CDN_URL;
  const url = cdnURL + '/' + cacheKey;
  //   do fetch request to check if image exists
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok;
  } catch (error) {
    return false;
  }
};

const processImage = async (dto: ImageOptimizationDto) => {
  const cdnUrl = process.env.CDN_URL;
  const fullPath = cdnUrl + dto.path;
  try {
    const res = await fetch(fullPath);
    if (!res.ok) {
      throw new Error('NOT_FOUND');
    }
    const buffer = await res.arrayBuffer();
    const data = await sharp(buffer)
      .resize(dto.width, dto.height)
      .jpeg({
        force: false,
        quality: dto.quality,
      })
      .toBuffer();

    const contentType = res.headers.get('content-type');

    return { data, contentType };
  } catch (error) {
    throw new Error('INTERNAL_SERVER_ERROR');
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const query = imageOptimizationDto.safeParse(req.query);
  if (!query.success) {
    return res.status(400).json({
      code: 400,
      error: 'INVALID_QUERY',
    });
  }
  try {
    const cacheKey = generateKey(query.data);
    const isExist = await imageExist(cacheKey);
    if (isExist) {
      const redirectUrl = `${process.env.CDN_URL}/${cacheKey}`;
      res.redirect(301, redirectUrl);
    } else {
      const { data: newImg, contentType } = await processImage(query.data);
      await S3.send(
        new PutObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: cacheKey,
          Body: newImg,
          ContentType: contentType as string,
        }),
      );
      res.redirect(301, `${process.env.CDN_URL}/${cacheKey}`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', code: 500 });
  }
}
