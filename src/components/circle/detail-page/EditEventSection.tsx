import EachPageLayout from '@/components/general/EachPageLayout';
import { useGetCircleBySlug } from '@/hooks/circle/useGetCircleBySlug';
import { useUpdateCircle } from '@/hooks/circle/useUpdateCircle';
import { useGetEvents } from '@/hooks/event/useGetEvent';
import ChevronUpIcon from '@/icons/ChevronUpIcon';
import { dayEnum } from '@/types/circle';
import { eventEntity } from '@/types/event';
import { prettifyError } from '@/utils/helper';
import { time } from '@/utils/time';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  useDisclosure,
} from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const editEventSchema = z.object({
  event: eventEntity,
  day: dayEnum.nullish(),
  block: z
    .string()
    .trim()
    .refine(
      (x) => {
        const splitted = x.split('-');
        return splitted.length === 2;
      },
      { message: 'Invalid block format (e.g. AA-123)' },
    )
    .refine(
      (x) => {
        const splitted = x.split('-');
        const prefix = splitted[0];
        if (prefix && prefix.length > 2) return false;
        if (!/^[A-Z]+$/.test(prefix)) return false;
        return true;
      },
      {
        message: 'Prefix should be maximum of 2 alphabets & all capitals',
      },
    )
    .refine(
      (x) => {
        const splitted = x.split('-');
        const suffix = splitted[1];
        if (suffix && suffix.length > 5) return false;
        if (!/^[a-z0-9]+$/.test(suffix)) return false;
        return true;
      },
      {
        message:
          'Suffix should be maximum of 5 alphanumeric characters & all lower case',
      },
    )
    .or(z.literal(''))
    .nullish(),
});

type EditEventForm = z.infer<typeof editEventSchema>;

const ConfirmationButton = () => {
  const { isOpen, onOpenChange } = useDisclosure();
  const { data: circle } = useGetCircleBySlug();
  const updateEvent = useUpdateCircle();
  const router = useRouter();
  return (
    <>
      <div className="mt-4 flex gap-4">
        <Button
          onClick={() => {
            onOpenChange();
          }}
          variant="solid"
          color="danger"
        >
          Reset
        </Button>
        <Button
          className="w-full font-medium text-white"
          type="submit"
          color="warning"
        >
          Update Attending Event
        </Button>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => {
            return (
              <>
                <ModalHeader>Are you sure ?</ModalHeader>
                <ModalBody>
                  Are you sure you want to reset attending events?
                </ModalBody>
                <ModalFooter>
                  <Button
                    onClick={onClose}
                    color="danger"
                    variant="ghost"
                    className="w-full"
                  >
                    No
                  </Button>
                  <Button
                    onClick={async () => {
                      if (!circle) return;
                      try {
                        await updateEvent.mutateAsync({
                          circleID: circle.id,
                          payload: {
                            circle_block: '',
                            event_id: 0,
                            day: '',
                          },
                        });
                        toast.success('Successfully reset attending event');
                        router.push({
                          pathname: '/[circleSlug]',
                          query: {
                            circleSlug: circle.slug,
                          },
                        });
                      } catch (error) {
                        toast.error(prettifyError(error as Error));
                      }
                    }}
                    color="primary"
                    variant="solid"
                    className="w-full"
                  >
                    Yes, Reset
                  </Button>
                </ModalFooter>
              </>
            );
          }}
        </ModalContent>
      </Modal>
    </>
  );
};

function EditEventSection() {
  const router = useRouter();
  const { data: circle } = useGetCircleBySlug();
  const { data, isLoading } = useGetEvents({ limit: 20, page: 1 });
  const [initalized, setInitalized] = useState(false);
  const form = useForm<EditEventForm>({
    resolver: zodResolver(editEventSchema),
  });
  const updateEvent = useUpdateCircle();

  useEffect(() => {
    if (initalized || !circle) return;
    const values = {} as EditEventForm;
    if (circle?.event) {
      values.event = circle.event;
    }
    values.block = circle.block?.name;
    values.day = circle.day;

    form.reset(values);

    setInitalized(true);
  }, [circle?.event?.id]);

  return (
    <EachPageLayout className="space-y-4">
      <div className="flex items-center gap-4">
        <ChevronUpIcon
          width={24}
          height={24}
          className="-rotate-90 cursor-pointer"
          onClick={() => router.back()}
        />
        <h1 className="text-xl font-bold">Edit Attending Event</h1>
      </div>

      {!!data && initalized && (
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(async (val) => {
              if (!circle) return;
              try {
                await updateEvent.mutateAsync({
                  circleID: circle.id,
                  payload: {
                    circle_block: val.block ?? undefined,
                    day: val.day ?? undefined,
                    event_id: val.event.id,
                  },
                });
                toast.success('Successfully updated attending event');
                router.push({
                  pathname: '/[circleSlug]',
                  query: {
                    circleSlug: circle.slug,
                  },
                });
              } catch (error) {
                toast.error(prettifyError(error as Error));
              }
            })}
            className="flex flex-col gap-4"
          >
            <Controller
              control={form.control}
              name="event"
              render={({ field }) => {
                const { onChange } = field;
                return (
                  <Select
                    color="primary"
                    variant="bordered"
                    items={data}
                    classNames={{
                      listbox: 'p-0',
                      popoverContent: 'p-0',
                    }}
                    renderValue={() => {
                      return <div>{field.value?.name}</div>;
                    }}
                    placeholder="Select an Event"
                    label="Event"
                    isLoading={isLoading}
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    isDisabled={field.disabled}
                    value={String(field.value?.id ?? '')}
                    selectedKeys={[String(field.value?.id ?? '')]}
                    isInvalid={!!form.formState.errors[field.name]}
                    errorMessage={form.formState.errors[field.name]?.message}
                  >
                    {(event) => {
                      return (
                        <SelectItem
                          key={String(event.id)}
                          textValue={event.name}
                          value={String(event.id)}
                          color="primary"
                          onPress={() => {
                            onChange(event);
                          }}
                        >
                          <div className="flex flex-col p-1">
                            <p className="font-semibold">{event.name}</p>
                            <div>
                              Time:{' '}
                              {time(event.started_at).format(
                                'dddd, DD MMMM YYYY HH:mm',
                              )}
                              -
                              {time(event.ended_at).format(
                                'dddd, DD MMMM YYYY HH:mm',
                              )}
                            </div>

                            {event.description && <p>{event.description}</p>}
                          </div>
                        </SelectItem>
                      );
                    }}
                  </Select>
                );
              }}
            />

            <Controller
              control={form.control}
              name="day"
              render={({ field }) => {
                const { disabled, value, ...fieldProps } = field;
                return (
                  <RadioGroup
                    isDisabled={disabled}
                    value={value ?? undefined}
                    {...fieldProps}
                    orientation="horizontal"
                    label="Attending Day"
                    size="sm"
                  >
                    <Radio value="first">First Day</Radio>
                    <Radio value="second">Second Day</Radio>
                    <Radio value="both">Both Days</Radio>
                  </RadioGroup>
                );
              }}
            />

            <Controller
              control={form.control}
              name="block"
              render={({ field }) => {
                const { disabled, value, ...fieldProps } = field;
                return (
                  <Input
                    isDisabled={disabled}
                    value={value ?? undefined}
                    variant="underlined"
                    isInvalid={!!form.formState.errors[field.name]}
                    errorMessage={form.formState.errors[field.name]?.message}
                    {...fieldProps}
                    label="Block"
                  />
                );
              }}
            />
            <ConfirmationButton />
          </form>
        </FormProvider>
      )}
    </EachPageLayout>
  );
}

export default EditEventSection;
