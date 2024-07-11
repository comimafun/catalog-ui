import EachPageLayout from '@/components/general/EachPageLayout';
import ExtendedImage from '@/components/general/ExtendedImage';
import Spin from '@/components/general/Spin';
import Uploader from '@/components/general/Uploader';
import { ACCEPTED_IMAGE_TYPES_SET, MEGABYTE } from '@/constants/common';
import { useGetCircleBySlug } from '@/hooks/circle/useGetCircleBySlug';
import { useUpdateCircle } from '@/hooks/circle/useUpdateCircle';
import ChevronUpIcon from '@/icons/ChevronUpIcon';
import StopIcon from '@/icons/StopIcon';
import TrashIcon from '@/icons/TrashIcon';
import { uploadService } from '@/services/upload';
import { downSizeForCoverImage, prettifyError } from '@/utils/helper';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

function EditCircleCutSection() {
  const [initialized, setInitialized] = useState(false);
  const [pending, setPending] = useState(false);
  const { data, isLoading } = useGetCircleBySlug();
  const router = useRouter();
  const form = useForm<{
    cover_picture_url: string;
  }>({
    defaultValues: {
      cover_picture_url: data?.cover_picture_url ?? '',
    },
  });
  const { mutateAsync } = useUpdateCircle();

  useEffect(() => {
    if (initialized || !data || isLoading) return;

    form.reset({
      cover_picture_url: data.cover_picture_url ?? '',
    });
    setInitialized(true);
  }, [initialized, isLoading]);

  return (
    <EachPageLayout className="space-y-4">
      <div className="flex items-center gap-4">
        <ChevronUpIcon
          width={24}
          height={24}
          className="-rotate-90 cursor-pointer"
          onClick={() => router.back()}
        />

        <h1 className="text-xl font-bold">Edit Circle Cut</h1>
      </div>

      <div className="rounded bg-warning px-4 py-2">
        <p className="font-semibold">Notes</p>
        <p>
          For better user experience, circle cut would programmatically
          downsized in quality
        </p>
        <p>Recommended aspect ratio is 7:10, and the minimum width is 140px.</p>
        <p>
          Accepted image types {Array.from(ACCEPTED_IMAGE_TYPES_SET).join(', ')}
        </p>
        <p>Maximum file size is 1 Megabytes</p>
        <p>Sorry for the inconvenience 🙇‍♂️</p>
      </div>
      <Spin spinning={pending}>
        <div className="flex items-center justify-center">
          <form
            onSubmit={form.handleSubmit(async (x) => {
              if (!data) return;
              try {
                setPending(true);
                await mutateAsync({
                  circleID: data.id,
                  payload: {
                    cover_picture_url: x.cover_picture_url,
                  },
                });
                toast.success('Circle Cut updated successfully');
              } catch (error) {
                toast.error(prettifyError(error as Error));
              } finally {
                setPending(false);
              }
            })}
          >
            <Controller
              control={form.control}
              name="cover_picture_url"
              render={({ field }) => {
                return (
                  <Fragment>
                    <Uploader
                      accept={Array.from(ACCEPTED_IMAGE_TYPES_SET).join(',')}
                      className="relative"
                      name={field.name}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      customRequest={async (files) => {
                        const file = files?.[0];
                        if (!file) return;
                        setPending(true);
                        try {
                          if (file.size > 1 * MEGABYTE) {
                            throw new Error('File size is too large');
                          }

                          if (!ACCEPTED_IMAGE_TYPES_SET.has(file.type)) {
                            throw new Error('File type is not accepted');
                          }

                          const resized = await downSizeForCoverImage(
                            file,
                            undefined,
                            0.6,
                          );
                          const { data: url } = await uploadService.uploadImage(
                            {
                              file: resized,
                              type: 'covers',
                            },
                          );

                          field.onChange(url);
                        } catch (error) {
                          toast.error(prettifyError(error as Error));
                        } finally {
                          setPending(false);
                        }
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-200/50 opacity-0 transition-all delay-200 hover:opacity-100">
                        <span className="rounded-[61px] bg-white px-2 py-1 font-medium">
                          Click to upload
                        </span>
                      </div>
                      {field.value ? (
                        <div className="w-auto overflow-hidden rounded-lg border border-neutral-100 shadow-lg md:h-[500px]">
                          <ExtendedImage
                            width={140}
                            height={200}
                            src={field.value}
                            alt={`Circle cut of` + data?.name}
                            className="aspect-[7/10] h-full w-full rounded-lg object-cover"
                            loading="lazy"
                            quality={100}
                          />
                        </div>
                      ) : (
                        <div className="overflow-hidden rounded-lg border border-neutral-100 shadow-lg">
                          <div className="flex aspect-[7/10] w-auto items-center justify-center rounded-lg bg-slate-200 md:h-[500px]">
                            <StopIcon
                              className="text-neutral-500"
                              width={36}
                              height={36}
                            />
                            <p className="font-semibold text-neutral-500">
                              No Image
                            </p>
                          </div>
                        </div>
                      )}
                    </Uploader>
                  </Fragment>
                );
              }}
            />

            <div className="mt-4 flex gap-2">
              <Button
                className="w-full font-semibold"
                color="warning"
                type="submit"
              >
                Update Circle Cut
              </Button>
              <Button
                onClick={() => {
                  form.reset({
                    cover_picture_url: '',
                  });
                }}
                isIconOnly
                className="px-1"
                color="danger"
              >
                <TrashIcon />
              </Button>
            </div>
          </form>
        </div>
      </Spin>
    </EachPageLayout>
  );
}

export default EditCircleCutSection;
