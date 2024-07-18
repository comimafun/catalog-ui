import { useDebounce } from '@/hooks/common/useDebounce';
import { useDrawerFilterStore } from '@/store/circle';
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from 'react-hook-form';
import { Drawer, DrawerContent } from '../general/Drawer';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Input,
  Radio,
  RadioGroup,
} from '@nextui-org/react';
import SearchIcon from '@/icons/SearchIcon';
import { useGetFandom } from '@/hooks/circle/useGetFandom';
import { motion } from 'framer-motion';
import { useGetWorkType } from '@/hooks/circle/useGetWorkType';
import { prettifyError } from '@/utils/helper';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { CircleFilterWithNoSearch } from '@/types/circle';
import { useParseCircleQueryToParams } from '@/hooks/circle/useParseClientQueryToParams';

const WorkTypeSection = () => {
  const filterForm = useFormContext<CircleFilterWithNoSearch>();
  const setFilterStepState = useDrawerFilterStore(
    (state) => state.setDrawerFilterStep,
  );
  const { data, isLoading, error } = useGetWorkType();

  const isEmpty = data?.length === 0 && !isLoading;

  const RenderFilter = () => {
    if (error) {
      const errMsg = prettifyError(error);
      return (
        <div className="flex items-center justify-center p-4 font-medium">
          {errMsg}
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="grid grid-cols-2 gap-1">
          {new Array(8).fill(0).map((_, idx) => {
            return (
              <div
                key={idx}
                className="h-9 w-full animate-pulse bg-slate-500"
              ></div>
            );
          })}
        </div>
      );
    }

    if (isEmpty) {
      return (
        <div className="flex items-center justify-center p-4 font-medium">
          Work Type not found
        </div>
      );
    }

    return (
      <Controller
        control={filterForm.control}
        name="work_type_id"
        render={({ field: { onChange, name, ref, value } }) => {
          return (
            <CheckboxGroup
              name={name}
              ref={ref}
              value={value.map(String) as unknown as string[]}
              onChange={(val) => onChange(val)}
              className="mt-4"
            >
              <div className="grid grid-cols-2 gap-1">
                {data?.map((workType) => {
                  return (
                    <Checkbox key={workType.id} value={String(workType.id)}>
                      {workType.name}
                    </Checkbox>
                  );
                })}
              </div>
            </CheckboxGroup>
          );
        }}
      />
    );
  };

  return (
    <motion.div
      className="flex flex-col"
      initial={{ opacity: 80, x: -5 }}
      animate={{ opacity: 100, x: 0 }}
    >
      <div className="font-medium text-foreground-500">Select Work Type</div>

      <RenderFilter />

      <div className="mt-2 flex gap-3 self-end">
        <Button
          type="button"
          variant="light"
          color="danger"
          onClick={() => filterForm.setValue('work_type_id', [])}
        >
          Reset Work Type
        </Button>
        <Button
          type="button"
          color="primary"
          onClick={() => setFilterStepState(null)}
          className="font-semibold"
        >
          Back
        </Button>
      </div>
    </motion.div>
  );
};

const SearchFandom = () => {
  const setSearchFandom = useDrawerFilterStore(
    (state) => state.setSearchFandom,
  );
  const searchFandom = useDrawerFilterStore((state) => state.searchFandom);
  const debouncedFandomSearch = useDebounce(searchFandom, 500);

  const { data, isLoading } = useGetFandom({
    limit: 20,
    page: 1,
    search: debouncedFandomSearch,
  });

  const isEmpty = data?.length === 0 && !isLoading;

  const setFilterStepState = useDrawerFilterStore(
    (state) => state.setDrawerFilterStep,
  );

  const filterForm = useFormContext<CircleFilterWithNoSearch>();

  return (
    <motion.div
      className="flex flex-col"
      initial={{ opacity: 80, x: -5 }}
      animate={{ opacity: 100, x: 0 }}
    >
      <Input
        variant="underlined"
        placeholder="Search fandom"
        value={searchFandom}
        onChange={(e) => setSearchFandom(e.target.value)}
        startContent={<SearchIcon width={16} height={16} />}
        isClearable
        onClear={() => setSearchFandom('')}
      />

      {isEmpty ? (
        <div className="flex items-center justify-center p-4 font-medium">
          Fandom not found
        </div>
      ) : (
        <Controller
          control={filterForm.control}
          name="fandom_id"
          render={({ field: { onChange, name, ref, value } }) => {
            return (
              <CheckboxGroup
                name={name}
                ref={ref}
                value={value.map(String) as string[]}
                onChange={(val) => onChange(val)}
                className="mt-4"
              >
                <div className="grid grid-cols-2 gap-1">
                  {data?.map((fandom) => {
                    return (
                      <Checkbox key={fandom.id} value={String(fandom.id)}>
                        {fandom.name}
                      </Checkbox>
                    );
                  })}
                </div>
              </CheckboxGroup>
            );
          }}
        />
      )}

      <div className="mt-2 flex gap-3 self-end">
        <Button
          type="button"
          variant="light"
          color="danger"
          onClick={() => filterForm.setValue('fandom_id', [])}
        >
          Reset Fandom
        </Button>
        <Button
          type="button"
          color="primary"
          onClick={() => setFilterStepState(null)}
          className="font-semibold"
        >
          Back
        </Button>
      </div>
    </motion.div>
  );
};

const MainFilter = () => {
  const setFilterStepState = useDrawerFilterStore(
    (state) => state.setDrawerFilterStep,
  );
  const filterForm = useFormContext<CircleFilterWithNoSearch>();

  return (
    <>
      <Controller
        control={filterForm.control}
        name="day"
        render={({ field: { disabled, onChange, ...fields } }) => {
          return (
            <RadioGroup
              label={<div className="font-medium">Day</div>}
              orientation="horizontal"
              isDisabled={disabled}
              {...fields}
              onValueChange={(a) => onChange(a)}
            >
              <Radio value="first">First Day</Radio>
              <Radio value="second">Second Day</Radio>
              <Radio value="both">Both Days</Radio>
            </RadioGroup>
          );
        }}
      />
      <Controller
        control={filterForm.control}
        name="fandom_id"
        render={({ field }) => {
          const val = field.value ?? [];

          return (
            <Button
              variant="flat"
              className="font-medium"
              type="button"
              onClick={() => setFilterStepState('fandom')}
              color={val.length > 0 ? 'primary' : 'warning'}
            >
              {val.length > 0
                ? `${val.length} fandom selected`
                : 'Select Fandom'}
            </Button>
          );
        }}
      />

      <Controller
        control={filterForm.control}
        name="work_type_id"
        render={({ field }) => {
          const val = field.value ?? [];

          return (
            <Button
              variant="flat"
              type="button"
              className="font-medium"
              onClick={() => setFilterStepState('work_type')}
              color={val.length > 0 ? 'primary' : 'warning'}
            >
              {val.length > 0
                ? `${val.length} type selected`
                : 'Select Work Type'}
            </Button>
          );
        }}
      />

      <hr className="my-3 w-full" />

      <Button type="submit" color="primary" variant="shadow">
        Apply
      </Button>
    </>
  );
};

const FilterDrawer = () => {
  const open = useDrawerFilterStore((state) => state.drawerFilterIsOpen);
  const setOpen = useDrawerFilterStore((state) => state.setDrawerFilterIsOpen);
  const filterStepState = useDrawerFilterStore(
    (state) => state.drawerFilterStep,
  );
  const reset = useDrawerFilterStore((state) => state.reset);
  const router = useRouter();

  const { filter } = useParseCircleQueryToParams();

  const filterForm = useForm<CircleFilterWithNoSearch>();

  useEffect(() => {
    if (open) {
      filterForm.reset({
        day: filter.day,
        fandom_id: filter.fandom_id,
        work_type_id: filter.work_type_id,
      });
    }
  }, [open]);

  return (
    <Drawer
      open={open}
      noBodyStyles
      onOpenChange={setOpen}
      onClose={() => reset()}
    >
      <DrawerContent className="p-4">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-base font-semibold">Filters</h1>
          {!filterStepState && (
            <Button
              type="button"
              color="danger"
              variant="light"
              onClick={() =>
                filterForm.reset(
                  {
                    day: '',
                    fandom_id: [],
                    work_type_id: [],
                  },
                  {
                    keepTouched: true,
                  },
                )
              }
            >
              Reset
            </Button>
          )}
        </div>
        <FormProvider {...filterForm}>
          <form
            className="flex flex-col gap-3"
            onSubmit={filterForm.handleSubmit((formData) => {
              Object.entries(formData).forEach(([key, values]) => {
                if (
                  !!values &&
                  (values?.length !== 0 || typeof values !== 'undefined')
                ) {
                  router.query[key] = values as string | string[];
                } else {
                  delete router.query[key];
                }
              });

              router.replace(
                {
                  query: router.query,
                },
                undefined,
                {
                  shallow: true,
                },
              );

              setOpen(false);
            })}
          >
            {!filterStepState && <MainFilter />}
            {filterStepState === 'fandom' && <SearchFandom />}
            {filterStepState === 'work_type' && <WorkTypeSection />}
          </form>
        </FormProvider>
      </DrawerContent>
    </Drawer>
  );
};

export default FilterDrawer;
