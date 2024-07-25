import EachPageLayout from '@/components/general/EachPageLayout';
import Spin from '@/components/general/Spin';
import { useSession } from '@/components/providers/SessionProvider';
import { useOnboarding } from '@/hooks/circle/useOnboarding';
import MegaphoneIcon from '@/icons/MegaphoneIcon';
import { onboardingPayloadSchema, RATING_ENUM } from '@/types/circle';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Select, SelectItem } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import nookies from 'nookies';
import { GetServerSidePropsContext } from 'next';

const joinSchema = onboardingPayloadSchema;

type JoinSchema = z.infer<typeof joinSchema>;

const useProtectRoute = () => {
  const { session, isLoading } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (isLoading) return;

    if (!isLoading && !session) {
      router.push({
        pathname: '/sign-in',
        query: { return_url: '/join' },
      });
      return;
    }

    if (!!session?.circle) {
      toast.error('You are already in a circle');
      router.push('/');
    }
  }, [isLoading, session?.circle?.id]);
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { access_token, refresh_token } = nookies.get(ctx);
  const { query } = ctx;

  if (!access_token && !refresh_token) {
    let return_url = '/join';
    if (query.referral) {
      return_url = `/join?referral=${query.referral}`;
    }

    const params = new URLSearchParams({
      return_url,
    }).toString();

    return {
      redirect: {
        destination: '/sign-in?' + params,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

function JoinPage() {
  useProtectRoute();
  const router = useRouter();
  const { handleOnboarding, isPending } = useOnboarding();
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

  useEffect(() => {
    if (!!router.query.referral) {
      form.setValue('referral_code', router.query.referral as string);
    }
  }, [router.query.referral]);

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
          <Spin spinning={isPending}>
            <FormProvider {...form}>
              <form
                className="gap-3"
                onSubmit={form.handleSubmit((val) => {
                  handleOnboarding(val);
                })}
              >
                <Input
                  label="Circle Name"
                  placeholder="e.g Harus Cuan Terus"
                  autoComplete="off"
                  variant="underlined"
                  isInvalid={!!form.formState.errors.name}
                  errorMessage={form.formState.errors.name?.message}
                  {...form.register('name')}
                />

                <Controller
                  control={form.control}
                  name="rating"
                  render={({ field, formState }) => {
                    return (
                      <Select
                        color="primary"
                        variant="underlined"
                        items={RATING_ENUM.map((x) => ({
                          id: x,
                          name: x,
                        }))}
                        classNames={{
                          listbox: 'p-0',
                          popoverContent: 'p-0',
                        }}
                        placeholder="Select your group rating"
                        label="Rating"
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        isDisabled={field.disabled}
                        value={field.value}
                        selectedKeys={new Set([field.value])}
                        isInvalid={!!formState.errors[field.name]}
                        errorMessage={formState.errors[field.name]?.message}
                      >
                        {({ id }) => {
                          return (
                            <SelectItem
                              key={id}
                              value={id}
                              textValue={id}
                              onPress={() => {
                                field.onChange(id);
                              }}
                            >
                              {id}
                            </SelectItem>
                          );
                        }}
                      </Select>
                    );
                  }}
                />

                <div className="grid grid-cols-1 gap-x-3 gap-y-6 xs:grid-cols-2">
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

                <Controller
                  control={form.control}
                  name="referral_code"
                  render={({ field, formState }) => {
                    return (
                      <Input
                        label="Referral Code (Optional)"
                        placeholder="Maybe ask your friend?"
                        autoComplete="off"
                        variant="underlined"
                        isInvalid={!!formState.errors.referral_code}
                        errorMessage={formState.errors.referral_code?.message}
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    );
                  }}
                />

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
