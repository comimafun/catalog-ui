import LoadingWrapper from '@/components/general/Spinner';
import { useSession } from '@/components/providers/SessionProvider';
import { ACCEPTED_IMAGE_TYPES, FIVE_MB } from '@/constants/common';
import { useOnboarding } from '@/hooks/circle/useOnboarding';
import ImageIcon from '@/icons/ImageIcon';
import MegaphoneIcon from '@/icons/MegaphoneIcon';
import { onboardingPayloadSchema } from '@/types/circle';
import { classNames } from '@/utils/classNames';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@nextui-org/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { FieldError, FieldErrorsImpl, Merge, useForm } from 'react-hook-form';
import { z } from 'zod';

const joinSchema = onboardingPayloadSchema.extend({
  file:
    typeof window === 'undefined'
      ? z.any()
      : z
          .instanceof(FileList)
          .refine((x) => x.length === 1, { message: 'Please select a file' })
          .refine((x) => x[0]?.size <= FIVE_MB, {
            message: 'Max file size is 5MB',
          })
          .refine((x) => ACCEPTED_IMAGE_TYPES.includes(x[0]?.type), {
            message: 'File type must be jpg, jpeg, png, or webp',
          }),
});

type JoinSchema = z.infer<typeof joinSchema>;

const useProtectRoute = () => {
  const { session, isLoading } = useSession();
  const _router = useRouter();
  useEffect(() => {
    if (isLoading) return;

    // if (!!session?.circle_id) {
    //   toast.error('You are already in a circle');
    //   router.push('/');
    // }
  }, [isLoading, session?.circle_id]);
};

// eslint-disable-next-line react/display-name
const Uploader = React.forwardRef<
  HTMLInputElement,
  {
    children: React.ReactNode;
    errorMessage?:
      | string
      | FieldError
      | Merge<FieldError, FieldErrorsImpl<any>>;
    isInvalid?: boolean;
  } & JSX.IntrinsicElements['input']
>((props, ref) => {
  const {
    children,
    className,
    name,
    errorMessage,
    isInvalid = false,
    ...rest
  } = props;
  return (
    <label
      className={classNames(
        'cursor-pointer space-y-2',
        props.disabled && 'cursor-none',
        className,
      )}
      htmlFor={name}
    >
      {children}
      {!!errorMessage && isInvalid && (
        <p className="text-tiny text-danger">{String(errorMessage)}</p>
      )}
      <input
        type="file"
        className="hidden"
        ref={ref}
        {...rest}
        name={name}
        id={name}
      />
    </label>
  );
});

function JoinPage() {
  useProtectRoute();
  const { handleOnboarding: _a, isPending } = useOnboarding();
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

  console.log(form.formState.errors);
  return (
    <main className="flex min-h-[calc(100vh-56px)] w-full items-center justify-center bg-white px-4 pt-4">
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

        <div className="mx-auto max-w-[360px] rounded-lg border border-neutral-950 p-4 shadow-md">
          <LoadingWrapper spinning={isPending}>
            <form
              className="gap-3"
              onSubmit={form.handleSubmit((val) => {
                console.log('submitted', val.file);
                // handleOnboarding(val)
              })}
            >
              <Uploader
                accept={ACCEPTED_IMAGE_TYPES.join(',')}
                className="mx-auto flex max-w-[200px] flex-col items-center justify-center"
                isInvalid={!!form.formState.errors.file}
                errorMessage={form.formState.errors.file?.message}
                {...form.register('file')}
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-500">
                  <ImageIcon
                    width={16}
                    height={16}
                    className="text-neutral-200"
                  />
                </div>
              </Uploader>
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
          </LoadingWrapper>
        </div>
      </div>
    </main>
  );
}

export default JoinPage;
