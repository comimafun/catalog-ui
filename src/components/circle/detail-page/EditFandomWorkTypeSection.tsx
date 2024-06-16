import EachPageLayout from '@/components/general/EachPageLayout';
import { useGetCircleBySlug } from '@/hooks/circle/useGetCircleBySlug';
import { useGetFandom } from '@/hooks/circle/useGetFandom';
import { useGetWorkType } from '@/hooks/circle/useGetWorkType';
import { usePostFandom } from '@/hooks/circle/usePostFandom';
import { useUpdateCircle } from '@/hooks/circle/useUpdateCircle';
import { useDebounce } from '@/hooks/common/useDebounce';
import ChevronUpIcon from '@/icons/ChevronUpIcon';
import XCircleIcon from '@/icons/XCircleIcon';
import { useEditFandomWorkTypeStore } from '@/store/circle';
import { classNames } from '@/utils/classNames';
import { prettifyError } from '@/utils/helper';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Checkbox, Input } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const TABS = [
  {
    label: 'Select Fandoms',
    value: 'fandom',
  },
  {
    label: 'Select Work Type',
    value: 'workType',
  },
] as const;

const updateFandomsSchema = z.object({
  fandom: z
    .array(z.object({ id: z.coerce.number(), name: z.string() }))
    .max(5, { message: 'You can only select up to 5 fandoms' })
    .default([]),
});

const updateWorkTypesSchema = z.object({
  work_type: z
    .array(z.object({ id: z.coerce.number(), name: z.string() }))
    .max(5, { message: 'You can only select up to 5 fandoms' })
    .default([]),
});

type UpdateFandomsSchema = z.infer<typeof updateFandomsSchema>;
type UpdateWorkTypesSchema = z.infer<typeof updateWorkTypesSchema>;

const WorkTypeSection = () => {
  const form = useFormContext<UpdateWorkTypesSchema>();
  const { data: circle } = useGetCircleBySlug();
  const { data: workTypes } = useGetWorkType();
  const updateWorkType = useUpdateCircle();

  return (
    <div className="space-y-1 p-4">
      <h2 className="text-base font-medium">Selected WorkType</h2>
      <form
        onSubmit={form.handleSubmit(async (val) => {
          if (!circle) return;
          try {
            const updated = await updateWorkType.mutateAsync({
              circleID: circle.id,
              payload: {
                work_type_ids: val.work_type.map((x) => x.id),
              },
            });
            form.reset({ work_type: updated.work_type });
            toast.success('Work Type updated successfully');
          } catch (error) {
            toast.error(prettifyError(error as Error));
          }
        })}
        className="grid gap-2"
      >
        <Controller
          control={form.control}
          name="work_type"
          render={({ field }) => {
            return (
              <ul className="flex flex-wrap gap-1">
                {field.value.map((workType) => {
                  return (
                    <li
                      key={workType.id}
                      className="group flex items-center justify-center gap-1 rounded-[61px] bg-secondary px-4 py-1 font-medium text-white transition-all hover:bg-secondary-500 hover:text-secondary-300"
                      role="button"
                      onClick={() => {
                        const newWorkType = field.value.filter(
                          (x) => x.id !== workType.id,
                        );
                        field.onChange(newWorkType);
                      }}
                    >
                      <span className="text-xs font-medium">
                        {workType.name}
                      </span>{' '}
                      <XCircleIcon width={16} height={16} />
                    </li>
                  );
                })}
              </ul>
            );
          }}
        />
        <p className="text-xs italic">You can only select up to 5 work types</p>

        <Controller
          control={form.control}
          name="work_type"
          render={({ field }) => {
            if (field.value.length === 0) {
              return <p>No work type found</p>;
            }
            return (
              <ul className="grid grid-cols-2">
                {workTypes?.map((type) => {
                  const isSelected = field.value.some((x) => x.id === type.id);
                  return (
                    <Checkbox
                      key={type.id}
                      isSelected={isSelected}
                      isDisabled={field.value.length >= 5 && !isSelected}
                      onChange={() => {
                        const newWorkType = isSelected
                          ? field.value.filter((x) => x.id !== type.id)
                          : [...field.value, type];
                        field.onChange(newWorkType);
                      }}
                    >
                      {type.name}
                    </Checkbox>
                  );
                })}
              </ul>
            );
          }}
        />

        <Controller
          control={form.control}
          name="work_type"
          render={({ fieldState, field }) => {
            return (
              <Button
                className="mt-4 font-medium text-neutral-100"
                type="submit"
                color="warning"
                fullWidth
                isDisabled={!fieldState.isDirty || field.value.length > 5}
              >
                Update Work Type
              </Button>
            );
          }}
        />
      </form>
    </div>
  );
};

const SearchFandom = () => {
  const localSearch = useEditFandomWorkTypeStore((s) => s.fandomLocalSearch);
  const setLocalSearch = useEditFandomWorkTypeStore(
    (s) => s.setFandomLocalSearch,
  );
  const setSearch = useEditFandomWorkTypeStore((s) => s.setFandomSearch);
  const debounced = useDebounce(localSearch, 500);

  useEffect(() => {
    setSearch(debounced.trim());
  }, [debounced]);

  return (
    <Input
      variant="underlined"
      placeholder="e.g Beastars"
      label="Search Fandom"
      onChange={(e) => setLocalSearch(e.target.value)}
      value={localSearch}
      isClearable
      onClear={() => {
        setLocalSearch('');
        setSearch('');
      }}
    />
  );
};

const FandomSection = () => {
  const search = useEditFandomWorkTypeStore((s) => s.fandomSearch);
  const setSearch = useEditFandomWorkTypeStore((s) => s.setFandomSearch);
  const setLocalSearch = useEditFandomWorkTypeStore(
    (s) => s.setFandomLocalSearch,
  );
  const { data } = useGetCircleBySlug();
  const { data: fandoms } = useGetFandom({ limit: 20, page: 1, search });
  const createFandom = usePostFandom();
  const form = useFormContext<UpdateFandomsSchema>();
  const updateFandom = useUpdateCircle();

  return (
    <div className="space-y-1 p-4">
      <h2 className="text-base font-medium">Selected Fandom</h2>

      <form
        onSubmit={form.handleSubmit(async (val) => {
          if (!data) return;
          try {
            const updated = await updateFandom.mutateAsync({
              circleID: data?.id,
              payload: {
                fandom_ids: val.fandom.map((x) => x.id),
              },
            });
            form.reset({ fandom: updated.fandom });
            toast.success('Fandom updated successfully');
          } catch (error) {
            toast.error(prettifyError(error as Error));
          }
        })}
        className="grid gap-2"
      >
        <Controller
          control={form.control}
          name="fandom"
          render={({ field }) => {
            return (
              <ul className="flex flex-wrap gap-1">
                {field.value.map((fandom) => {
                  return (
                    <li
                      key={fandom.id}
                      className="group flex items-center justify-center gap-1 rounded-[61px] bg-secondary px-4 py-1 font-medium text-white transition-all hover:bg-secondary-500 hover:text-secondary-300"
                      role="button"
                      onClick={() => {
                        const newFandom = field.value.filter(
                          (x) => x.id !== fandom.id,
                        );
                        field.onChange(newFandom);
                      }}
                    >
                      <span className="text-xs font-medium">{fandom.name}</span>{' '}
                      <XCircleIcon width={16} height={16} />
                    </li>
                  );
                })}
              </ul>
            );
          }}
        />
        <p className="text-xs italic">You can only select up to 5 fandoms</p>

        <SearchFandom />

        <Controller
          control={form.control}
          name="fandom"
          render={({ field }) => {
            if ((fandoms?.length ?? 0) === 0) {
              return (
                <div className="flex w-full items-center justify-center gap-1 bg-primary-50 px-2 py-1">
                  <p>
                    No fandom found. Add <b>{search}</b> fandom?
                  </p>
                  <button
                    className="rounded-[61px] bg-success-500 px-2 py-0.5 font-medium text-white transition-all hover:bg-success-700 active:scale-90"
                    type="button"
                    onClick={async () => {
                      if (field.value.length >= 5) {
                        toast.error('You can only select up to 5 fandoms');
                        return;
                      }
                      if (!search.trim()) {
                        toast.error('Name cannot be empty');
                        return;
                      }
                      try {
                        const name = z
                          .string()
                          .min(1)
                          .max(255)
                          .trim()
                          .parse(search);
                        const { data } = await createFandom.mutateAsync(name);
                        setSearch('');
                        setLocalSearch('');
                        field.onChange([...field.value, data]);
                      } catch (error) {
                        toast.error(prettifyError(error as Error));
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
              );
            }

            return (
              <ul className="mt-4 grid grid-cols-2 gap-1">
                {fandoms?.map((fandom) => {
                  const isChecked = field.value.some((x) => x.id === fandom.id);
                  return (
                    <Checkbox
                      isDisabled={field.value.length >= 5 && !isChecked}
                      onChange={() => {
                        const newFandom = isChecked
                          ? field.value.filter((x) => x.id !== fandom.id)
                          : [...field.value, fandom];
                        field.onChange(newFandom);
                      }}
                      key={fandom.id}
                      isSelected={isChecked}
                      classNames={{
                        label: 'text-sm',
                      }}
                    >
                      {fandom.name}
                    </Checkbox>
                  );
                })}
              </ul>
            );
          }}
        />

        <Controller
          control={form.control}
          name="fandom"
          render={({ fieldState, field }) => {
            return (
              <Button
                className="mt-4 font-medium text-neutral-100"
                type="submit"
                color="warning"
                fullWidth
                isDisabled={!fieldState.isDirty || field.value.length > 5}
              >
                Update Fandom
              </Button>
            );
          }}
        />
      </form>
    </div>
  );
};

function EditFandomWorkTypeSection() {
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();
  const currentTab = useEditFandomWorkTypeStore((s) => s.tab);
  const setTab = useEditFandomWorkTypeStore((s) => s.setTab);
  const reset = useEditFandomWorkTypeStore((s) => s.reset);
  const { data } = useGetCircleBySlug();
  const fandomForm = useForm<UpdateFandomsSchema>({
    resolver: zodResolver(updateFandomsSchema),
    defaultValues: {
      fandom: data?.fandom ?? [],
    },
  });

  const workTypeForm = useForm<UpdateWorkTypesSchema>({
    resolver: zodResolver(updateWorkTypesSchema),
    defaultValues: {
      work_type: data?.work_type ?? [],
    },
  });

  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  useEffect(() => {
    if (initialized && !data) return;

    fandomForm.reset({ fandom: data?.fandom ?? [] });
    workTypeForm.reset({ work_type: data?.work_type ?? [] });
    setInitialized(true);
  }, [data?.fandom]);

  return (
    <EachPageLayout className="space-y-4 p-0">
      <div className="flex items-center gap-4 px-4 pt-4">
        <ChevronUpIcon
          width={24}
          height={24}
          className="-rotate-90 cursor-pointer"
          onClick={() => router.back()}
        />
        <h1 className="text-xl font-bold">Edit Circle Speciality</h1>
      </div>
      <section className="w-full space-y-1">
        <div className="grid w-full grid-cols-2">
          {TABS.map((x) => {
            const isActive = x.value === currentTab;
            return (
              <button
                type="button"
                key={x.value}
                className={classNames(
                  'bg-neutral-50 p-4 text-center transition-all',
                  isActive
                    ? 'bg-primary-500 font-semibold text-white'
                    : 'text-neutral-500',
                )}
                onClick={() => setTab(x.value)}
              >
                {x.label}
              </button>
            );
          })}
        </div>
        <FormProvider {...fandomForm}>
          {currentTab === 'fandom' ? <FandomSection /> : null}
        </FormProvider>
        <FormProvider {...workTypeForm}>
          {currentTab === 'workType' ? <WorkTypeSection /> : null}
        </FormProvider>
      </section>
    </EachPageLayout>
  );
}

export default EditFandomWorkTypeSection;
