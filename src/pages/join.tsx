import EachPageLayout from '@/components/general/EachPageLayout';
import Spin from '@/components/general/Spin';
import Uploader from '@/components/general/Uploader';
import { useSession } from '@/components/providers/SessionProvider';
import { ACCEPTED_IMAGE_TYPES_SET, MEGABYTE } from '@/constants/common';
import { useOnboarding } from '@/hooks/circle/useOnboarding';
import ImageIcon from '@/icons/ImageIcon';
import MegaphoneIcon from '@/icons/MegaphoneIcon';
import { uploadService } from '@/services/upload';
import { onboardingPayloadSchema } from '@/types/circle';
import { prettifyError } from '@/utils/helper';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@nextui-org/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const acceptedTypes = Array.from(ACCEPTED_IMAGE_TYPES_SET).join(', ');

const joinSchema = onboardingPayloadSchema;

type JoinSchema = z.infer<typeof joinSchema>;

const useProtectRoute = () => {
  const { session, isLoading } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (isLoading) return;

    if (!!session?.circle) {
      toast.error('You are already in a circle');
      router.push('/');
    }
  }, [isLoading, session?.circle?.id]);
};

function JoinPage() {
  useProtectRoute();
  const { handleOnboarding, isPending } = useOnboarding();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<JoinSchema>({
    resolver: zodResolver(joinSchema),
    defaultValues: {
      name: '',
      url: '',
      picture_url: '',
      twitter_url: '',
      instagram_url: '',
      facebook_url: '',
    },
  });

  return (
    <EachPageLayout className="flex items-center justify-center">
      <div className="w-full space-y-3">
        <h1 className="text-center text-xl font-bold">
          Create your circle profile,
          <br />
          and share it to the world!
        </h1>
        <div className="flex items-center justify-center gap-2">
          <MegaphoneIcon width={16} height={16} />
          <p className="font-medium">Help us create better community!</p>
        </div>

        <div className="mx-auto max-w-[400px] rounded-lg border border-neutral-950 p-4 shadow-md">
          <Spin spinning={isPending || isLoading}>
            <FormProvider {...form}>
              <form
                className="gap-3"
                onSubmit={form.handleSubmit((val) => {
                  setIsLoading(true);
                  handleOnboarding(val).catch(() => {
                    setIsLoading(false);
                  });
                })}
              >
                <Controller
                  control={form.control}
                  name="picture_url"
                  render={({ field, formState }) => {
                    return (
                      <Uploader
                        accept={Array.from(ACCEPTED_IMAGE_TYPES_SET).join(',')}
                        className="mx-auto flex max-w-[200px] flex-col items-center justify-center"
                        isInvalid={!!formState.errors.picture_url}
                        errorMessage={String(
                          formState.errors.picture_url?.message,
                        )}
                        customRequest={async (files) => {
                          try {
                            setIsLoading(true);
                            const file = files?.[0];
                            if (!file) return;

                            if (file.size > 1 * MEGABYTE) {
                              toast.error('Max file size is 1MB');
                              return;
                            }

                            if (!ACCEPTED_IMAGE_TYPES_SET.has(file.type)) {
                              toast.error('File type must be' + acceptedTypes);
                              return;
                            }
                            const formData = new FormData();

                            formData.append('file', file);
                            formData.append('type', 'circles');

                            const { data } = await uploadService.uploadImage({
                              file,
                              type: 'profiles',
                            });
                            field.onChange(data);
                          } catch (error) {
                            toast.error(prettifyError(error as Error));
                          } finally {
                            setIsLoading(false);
                          }
                        }}
                        name={field.name}
                        onBlur={field.onBlur}
                        ref={field.ref}
                      >
                        {field.value ? (
                          <div className="relative">
                            <div className="absolute inset-0 rounded-full transition-all hover:bg-slate-500/50" />
                            <Image
                              width={96}
                              height={96}
                              src={field.value}
                              alt="Circle picture profile"
                              className="h-24 w-24 rounded-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-500">
                            <ImageIcon
                              width={16}
                              height={16}
                              className="text-neutral-200"
                            />
                          </div>
                        )}
                      </Uploader>
                    );
                  }}
                />

                <Input
                  label="Circle Name"
                  placeholder="e.g Harus Cuan Terus"
                  autoComplete="off"
                  variant="underlined"
                  isInvalid={!!form.formState.errors.name}
                  errorMessage={form.formState.errors.name?.message}
                  {...form.register('name')}
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Circle URL (Optional)"
                    placeholder="Enter valid url"
                    autoComplete="off"
                    variant="underlined"
                    isInvalid={!!form.formState.errors.url}
                    errorMessage={form.formState.errors.url?.message}
                    {...form.register('url')}
                  />

                  <Input
                    label="Twitter URL (Optional)"
                    placeholder="Enter valid url"
                    autoComplete="off"
                    variant="underlined"
                    isInvalid={!!form.formState.errors.twitter_url}
                    errorMessage={form.formState.errors.twitter_url?.message}
                    {...form.register('twitter_url')}
                  />

                  <Input
                    label="Instagram URL (Optional)"
                    placeholder="Enter valid url"
                    autoComplete="off"
                    variant="underlined"
                    isInvalid={!!form.formState.errors.instagram_url}
                    errorMessage={form.formState.errors.instagram_url?.message}
                    {...form.register('instagram_url')}
                  />

                  <Input
                    label="Facebook URL (Optional)"
                    placeholder="Enter valid url"
                    autoComplete="off"
                    variant="underlined"
                    isInvalid={!!form.formState.errors.facebook_url}
                    errorMessage={form.formState.errors.facebook_url?.message}
                    {...form.register('facebook_url')}
                  />
                </div>
                <Button
                  fullWidth
                  className="mt-4"
                  color="primary"
                  type="submit"
                  isLoading={isPending}
                >
                  Register
                </Button>
              </form>
            </FormProvider>
          </Spin>
        </div>
      </div>
    </EachPageLayout>
  );
}

export default JoinPage;
