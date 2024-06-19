import EachPageLayout from '@/components/general/EachPageLayout';
import LoadingWrapper from '@/components/general/Spinner';
import Uploader from '@/components/general/Uploader';
import { ACCEPTED_IMAGE_TYPES } from '@/constants/common';
import { useGetCircleBySlug } from '@/hooks/circle/useGetCircleBySlug';
import { useUpdateCircle } from '@/hooks/circle/useUpdateCircle';
import ChevronUpIcon from '@/icons/ChevronUpIcon';
import ImageIcon from '@/icons/ImageIcon';
import {
  EditGeneralInfoPayload,
  editGeneralInfoPayload,
  updateCirclePayload,
} from '@/types/circle';
import { prettifyError } from '@/utils/helper';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button } from '@nextui-org/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { FormProvider, Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

function EditGeneralInfoSection() {
  const [initialized, setInitialized] = useState(false);
  const { data, isLoading, error } = useGetCircleBySlug();
  const router = useRouter();
  const form = useForm<EditGeneralInfoPayload>({
    resolver: zodResolver(editGeneralInfoPayload),
  });
  const { handleSubmit, register, control } = form;
  const { mutateAsync, isPending } = useUpdateCircle();

  useEffect(() => {
    if (initialized || !data) return;

    form.reset({
      name: data.name,
      url: data.url ?? '',
      twitter_url: data.twitter_url ?? '',
      instagram_url: data.instagram_url ?? '',
      facebook_url: data.facebook_url ?? '',
      picture_url: data.picture_url ?? '',
    });
    setInitialized(true);
  }, [initialized, data, error, isLoading]);
  return (
    <EachPageLayout className="space-y-4">
      <div className="flex items-center gap-4">
        <ChevronUpIcon
          width={24}
          height={24}
          className="-rotate-90 cursor-pointer"
          onClick={() => router.back()}
        />
        <h1 className="text-xl font-bold">Edit General Info</h1>
      </div>
      <section className="w-full rounded-lg border border-neutral-950 p-4">
        <LoadingWrapper spinning={isPending}>
          <FormProvider {...form}>
            <form
              className="flex flex-col gap-2"
              onSubmit={handleSubmit(async (val) => {
                if (!data || isPending) return;

                try {
                  const payload = updateCirclePayload.parse(val);
                  const updated = await mutateAsync({
                    circleID: data.id,
                    payload,
                  });
                  toast.success('Circle updated successfully');
                  router.push({
                    pathname: '/[circleSlug]',
                    query: { circleSlug: updated.slug },
                  });
                } catch (error) {
                  toast.error(prettifyError(error as Error));
                }
              })}
            >
              <Uploader
                accept={ACCEPTED_IMAGE_TYPES.join(',')}
                className="mx-auto flex max-w-[200px] flex-col items-center justify-center"
                isInvalid={!!form.formState.errors.file}
                errorMessage={String(form.formState.errors.file?.message)}
                {...register('file')}
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-500 transition-all hover:shadow-2xl">
                  <ImageIcon
                    width={16}
                    height={16}
                    className="text-neutral-200"
                  />
                </div>
              </Uploader>

              <Controller
                control={control}
                name="name"
                render={({ field }) => {
                  return (
                    <Input
                      variant="underlined"
                      placeholder="Enter circle name"
                      isInvalid={!!form.formState.errors.name}
                      errorMessage={form.formState.errors.name?.message}
                      label={<div className="font-medium">Circle Name</div>}
                      description={
                        <div className="text-warning">
                          Changing circle name will affect your page URL
                        </div>
                      }
                      {...field}
                    />
                  );
                }}
              />

              <Input
                label="Circle URL (Optional)"
                placeholder="Enter valid url"
                autoComplete="off"
                variant="underlined"
                isInvalid={!!form.formState.errors.url}
                errorMessage={form.formState.errors.url?.message}
                {...register('url')}
              />

              <Input
                label="Twitter URL (Optional)"
                placeholder="Enter valid url"
                autoComplete="off"
                variant="underlined"
                isInvalid={!!form.formState.errors.twitter_url}
                errorMessage={form.formState.errors.twitter_url?.message}
                {...register('twitter_url')}
              />

              <Input
                label="Instagram URL (Optional)"
                placeholder="Enter valid url"
                autoComplete="off"
                variant="underlined"
                isInvalid={!!form.formState.errors.instagram_url}
                errorMessage={form.formState.errors.instagram_url?.message}
                {...register('instagram_url')}
              />

              <Input
                label="Facebook URL (Optional)"
                placeholder="Enter valid url"
                autoComplete="off"
                variant="underlined"
                isInvalid={!!form.formState.errors.facebook_url}
                errorMessage={form.formState.errors.facebook_url?.message}
                {...register('facebook_url')}
              />

              <Button
                type="submit"
                fullWidth
                color="warning"
                className="mt-4 font-semibold text-neutral-100"
              >
                Update General Info
              </Button>
            </form>
          </FormProvider>
        </LoadingWrapper>
      </section>
    </EachPageLayout>
  );
}

export default EditGeneralInfoSection;
