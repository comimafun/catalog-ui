import EachPageLayout from '@/components/general/EachPageLayout';
import EditorWYSIWYG from '@/components/general/Editor';
import { useGetCircleBySlug } from '@/hooks/circle/useGetCircleBySlug';
import { useUpdateCircle } from '@/hooks/circle/useUpdateCircle';
import ChevronUpIcon from '@/icons/ChevronUpIcon';
import { prettifyError } from '@/utils/helper';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/react';
import { sanitize } from 'isomorphic-dompurify';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const updateDescriptionFormSchema = z.object({
  description: z.string(),
});
type UpdateDescriptionFormSchema = z.infer<typeof updateDescriptionFormSchema>;

function EditDescriptionSection() {
  const [initalized, setInitalized] = useState(false);
  const { data } = useGetCircleBySlug();
  const router = useRouter();
  const form = useForm<UpdateDescriptionFormSchema>({
    resolver: zodResolver(updateDescriptionFormSchema),
    defaultValues: {
      description: data?.description ? sanitize(data?.description) : '',
    },
  });
  const updateDescription = useUpdateCircle();

  useEffect(() => {
    if (!data?.description || initalized) return;

    form.reset({
      description: sanitize(data?.description),
    });
    setInitalized(true);
  }, [data?.description]);

  return (
    <EachPageLayout className="space-y-4">
      <div className="flex items-center gap-4">
        <ChevronUpIcon
          width={24}
          height={24}
          className="-rotate-90 cursor-pointer"
          onClick={() => router.back()}
        />

        <h1 className="text-xl font-bold">Edit Description</h1>
      </div>

      <form
        onSubmit={form.handleSubmit(async (val) => {
          if (!data?.id) return;
          try {
            const sanitizedDescription = sanitize(val.description);
            await updateDescription.mutateAsync({
              circleID: data?.id,
              payload: {
                description: sanitizedDescription,
              },
            });
            toast.success('Description updated successfully');
            router.push({
              pathname: '/[circleSlug]',
              query: { circleSlug: data?.slug },
            });
          } catch (error) {
            toast.error(prettifyError(error as Error));
          }
        })}
      >
        <Controller
          control={form.control}
          name="description"
          render={({ field }) => {
            return (
              <EditorWYSIWYG
                onChange={(html) => field.onChange(html)}
                content={data?.description ? sanitize(data?.description) : ''}
              />
            );
          }}
        />

        <Button
          type="submit"
          fullWidth
          color="warning"
          className="mt-4 font-semibold text-neutral-100"
          isLoading={updateDescription.isPending}
        >
          Update Description
        </Button>
      </form>
    </EachPageLayout>
  );
}

export default EditDescriptionSection;
