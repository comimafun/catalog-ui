import EachPageLayout from '@/components/general/EachPageLayout';
import ExtendedImage from '@/components/general/ExtendedImage';
import Spin from '@/components/general/Spin';
import Uploader from '@/components/general/Uploader';
import { ACCEPTED_IMAGE_TYPES_SET, MEGABYTE } from '@/constants/common';
import { useGetCircleBySlug } from '@/hooks/circle/useGetCircleBySlug';
import {
  getProductsOptions,
  useGetProducts,
} from '@/hooks/circle/useGetProducts';
import ChevronUpIcon from '@/icons/ChevronUpIcon';
import EditIcon from '@/icons/EditIcon';
import ImageIcon from '@/icons/ImageIcon';
import TrashIcon from '@/icons/TrashIcon';
import XCircleIcon from '@/icons/XCircleIcon';
import { productService } from '@/services/product';
import { uploadService } from '@/services/upload';
import { productEntity } from '@/types/product';
import { prettifyError } from '@/utils/helper';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

type Product = z.infer<typeof productEntity>;

const schema = z.object({
  id: z.number().min(1).optional(),
  name: z.string().trim().min(5).max(100),
  image_url: z
    .string()
    .trim()
    .min(1, {
      message: 'Image is required',
    })
    .url(),
});

type FormValues = z.infer<typeof schema>;

const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      circleID,
      ...payload
    }: FormValues & { circleID: number }) => {
      const { data } =
        await productService.putUpdateOneProductByCircleIDProductID({
          circleID,
          payload: {
            name: payload.name,
            image_url: payload.image_url,
            id: payload.id as number,
          },
        });
      return data;
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({
        queryKey: getProductsOptions({ circleID: payload.circleID }).queryKey,
      });

      const previousData = queryClient.getQueryData(
        getProductsOptions({ circleID: payload.circleID }).queryKey,
      );

      queryClient.setQueryData(
        getProductsOptions({ circleID: payload.circleID }).queryKey,
        (oldData: Array<Product>) => {
          return oldData?.map((x) => {
            if (x.id === payload.id) {
              return {
                name: payload.name,
                image_url: payload.image_url,
                id: payload.id,
              };
            }
            return x;
          });
        },
      );

      return { previousData };
    },
    onError: (_error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          getProductsOptions({ circleID: variables.circleID }).queryKey,
          context.previousData,
        );
      }
    },
  });
};

const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      circleID,
      ...payload
    }: FormValues & { circleID: number }) => {
      const { data } = await productService.postAddProductByCircleID(
        circleID,
        payload,
      );
      return data;
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({
        queryKey: getProductsOptions({ circleID: payload.circleID }).queryKey,
      });

      const previousData = queryClient.getQueryData(
        getProductsOptions({ circleID: payload.circleID }).queryKey,
      );

      queryClient.setQueryData(
        getProductsOptions({ circleID: payload.circleID }).queryKey,
        (oldData: Array<Product>) => {
          return [
            ...(oldData ?? []),
            {
              name: payload.name,
              image_url: payload.image_url,
              id: Math.random(),
            },
          ];
        },
      );

      return { previousData };
    },
    onError: (_error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          getProductsOptions({ circleID: variables.circleID }).queryKey,
          context.previousData,
        );
      }
    },

    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({
        queryKey: getProductsOptions({ circleID: payload.circleID }).queryKey,
        refetchType: 'active',
      });
    },
  });
};

const ProductList = () => {
  const { data } = useGetCircleBySlug();
  const { data: products } = useGetProducts({
    circleID: data?.id,
  });
  const [deleteSelected, setDeleteSelected] = useState<Product | null>(null);
  const { isOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const form = useFormContext<FormValues>();
  return (
    <ul className="mt-4 flex flex-col gap-2">
      <Modal
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (isLoading) return;
          if (!open) {
            setDeleteSelected(null);
          }
          onOpenChange();
        }}
        placement="center"
        hideCloseButton
        onClose={() => setDeleteSelected(null)}
      >
        <ModalContent>
          {(onClose) => {
            return (
              <Spin spinning={isLoading}>
                <ModalBody>
                  <p className="text-base font-bold">
                    Are you sure you want to delete {deleteSelected?.name} ?
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    className="font-medium"
                    variant="ghost"
                    color="warning"
                    onPress={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    onPress={async () => {
                      try {
                        await productService.deleteOneProductByCircleIDProductID(
                          {
                            circleID: data?.id as number,
                            productID: deleteSelected?.id as number,
                          },
                        );
                        setDeleteSelected(null);
                        onClose();
                        queryClient.invalidateQueries({
                          queryKey: getProductsOptions({
                            circleID: data?.id as number,
                          }).queryKey,
                          refetchType: 'active',
                        });
                      } catch (error) {
                        toast.error(prettifyError(error as Error));
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    color="danger"
                    className="font-bold"
                  >
                    Delete
                  </Button>
                </ModalFooter>
              </Spin>
            );
          }}
        </ModalContent>
      </Modal>
      {products?.map((x) => {
        return (
          <li
            className="flex w-full items-center gap-4 rounded-lg border border-neutral-900 p-2.5 shadow-lg"
            key={x.id}
          >
            <div className="h-[60px] min-h-[60px] w-[60px] min-w-[60px]">
              <ExtendedImage
                src={x.image_url}
                alt={x.name}
                width={60}
                height={60}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="text-lg font-semibold">{x.name}</div>

            <div className="ml-auto flex gap-2">
              <Button
                isIconOnly
                color="warning"
                onPress={() => {
                  form.reset({
                    id: x.id,
                    name: x.name,
                    image_url: x.image_url,
                  });
                }}
              >
                <EditIcon width={20} height={20} />
              </Button>
              <Button
                onPress={() => {
                  setDeleteSelected(x);
                  onOpenChange();
                }}
                className="text-white"
                color="danger"
                isIconOnly
              >
                <TrashIcon width={20} height={20} />
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

function EditProducts() {
  const router = useRouter();
  const { data } = useGetCircleBySlug();
  const [isUploading, setIsUploading] = useState(false);
  const { data: products } = useGetProducts({ circleID: data?.id });
  const addMutation = useAddProduct();
  const updateMutation = useUpdateProduct();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      image_url: '',
    },
  });

  return (
    <EachPageLayout className="space-y-4">
      <div className="flex items-center gap-4">
        <ChevronUpIcon
          width={24}
          height={24}
          className="-rotate-90 cursor-pointer"
          onClick={() => router.back()}
        />
        <h1 className="text-xl font-bold">Edit Works Displayed</h1>
      </div>

      <FormProvider {...form}>
        <section>
          <form
            onSubmit={form.handleSubmit(async (payload) => {
              if (!data?.id) return;

              try {
                if ((products?.length ?? 0) >= 5) {
                  throw new Error('You can only add up to 5 products');
                }
                if (payload.id) {
                  await updateMutation.mutateAsync({
                    circleID: data.id,
                    ...payload,
                  });

                  toast.success('Works updated ✅');
                } else {
                  await addMutation.mutateAsync({
                    circleID: data.id,
                    ...payload,
                  });

                  toast.success('Works added ✅');
                }

                form.reset({
                  id: undefined,
                  name: '',
                  image_url: '',
                });
              } catch (error) {
                toast.error(prettifyError(error as Error));
              }
            })}
          >
            <div className="flex flex-col gap-2 rounded border border-neutral-900 p-2.5">
              <Controller
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <Input
                      isInvalid={!!form.formState.errors[field.name]}
                      errorMessage={form.formState.errors[field.name]?.message}
                      label="Work Name"
                      variant="underlined"
                      placeholder='e.g. "Commision examples"'
                      size="sm"
                      {...field}
                    />
                  );
                }}
              />

              <Controller
                control={form.control}
                name="image_url"
                render={({ field }) => {
                  return (
                    <Fragment>
                      {field.value && (
                        <>
                          <div className="relative h-[270px] w-full bg-slate-500/50 md:h-[320px] lg:h-[400px]">
                            <ExtendedImage
                              alt="uploaded product"
                              src={field.value}
                              width={586}
                              height={400}
                              loading="lazy"
                              className="h-full w-full object-contain"
                            />
                            <button
                              type="button"
                              className="absolute right-4 top-4 rounded-full bg-slate-100 p-1 hover:bg-slate-500 hover:text-white"
                              onClick={() => {
                                field.onChange('');
                              }}
                            >
                              <XCircleIcon width={16} height={16} />
                            </button>
                          </div>
                          <hr className="my-1 w-full bg-neutral-900" />
                        </>
                      )}
                    </Fragment>
                  );
                }}
              />

              <div className="flex w-full justify-between gap-2">
                <Controller
                  control={form.control}
                  name="image_url"
                  render={({ field }) => {
                    return (
                      <Uploader
                        accept={Array.from(ACCEPTED_IMAGE_TYPES_SET).join(',')}
                        errorMessage={
                          form.formState.errors[field.name]?.message
                        }
                        isInvalid={!!form.formState.errors[field.name]}
                        onBlur={field.onBlur}
                        name={field.name}
                        customRequest={async (files) => {
                          const file = files?.[0];
                          if (!file) return;
                          try {
                            setIsUploading(true);

                            if (file.size > 5 * MEGABYTE) {
                              throw new Error(
                                'File size should be less than 5MB',
                              );
                            }
                            if (!ACCEPTED_IMAGE_TYPES_SET.has(file.type)) {
                              throw new Error(
                                `Image type should be one of ${Array.from(ACCEPTED_IMAGE_TYPES_SET).join(', ')}`,
                              );
                            }

                            form.clearErrors('image_url');
                            const { data } = await uploadService.uploadImage({
                              file: file,
                              type: 'products',
                            });

                            field.onChange(data);
                          } catch (error) {
                            toast.error(prettifyError(error as Error));
                          } finally {
                            setIsUploading(false);
                          }
                        }}
                        className="flex w-full flex-col"
                      >
                        <div className="group:hover:bg-blue-500 group flex h-full max-h-[200px] w-full flex-col items-center justify-center bg-blue-100 transition-all delay-100 hover:bg-blue-500">
                          <ImageIcon
                            width={24}
                            height={24}
                            className="text-blue-500 delay-100 group-hover:text-white"
                          />
                        </div>
                      </Uploader>
                    );
                  }}
                />

                <Controller
                  name="id"
                  render={({ field }) => {
                    return (
                      <Button
                        color="warning"
                        className="font-semibold"
                        type="submit"
                        size="sm"
                        isLoading={isUploading}
                        isDisabled={isUploading}
                      >
                        {!!field.value ? 'Update' : 'Add'}
                      </Button>
                    );
                  }}
                  control={form.control}
                />
              </div>
            </div>
          </form>

          <ProductList />
        </section>
      </FormProvider>
    </EachPageLayout>
  );
}

export default EditProducts;
