import {
  useGetCircleBySlug,
  useIsMyCircle,
} from '@/hooks/circle/useGetCircleBySlug';
import { useGetProducts } from '@/hooks/circle/useGetProducts';
import EditIcon from '@/icons/EditIcon';
import SearchIcon from '@/icons/SearchIcon';
import XCircleIcon from '@/icons/XCircleIcon';
import { productEntity } from '@/types/circle';
import { classNames } from '@/utils/classNames';
import {
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, ReactNode, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperTypes } from 'swiper/types';
import { z } from 'zod';

const Wrapper = ({ children }: { children: ReactNode }) => {
  const { isAllowed } = useIsMyCircle();
  const { data } = useGetCircleBySlug();

  return (
    <>
      <div className="mb-2 flex w-full justify-between">
        <h2 className="text-xl font-semibold">Our works</h2>

        {isAllowed && (
          <Link
            href={{
              pathname: '/[circleSlug]/edit',
              query: { circleSlug: data?.slug, section: 'description' },
            }}
          >
            <Chip
              color="warning"
              endContent={<EditIcon width={14} height={14} />}
            >
              <span className="font-semibold">Edit</span>
            </Chip>
          </Link>
        )}
      </div>

      {children}
    </>
  );
};

const productsSchema = z.array(productEntity);
type Products = z.infer<typeof productsSchema>;

const ProductList = ({ products }: { products: Products }) => {
  const swiperRef = useRef<SwiperTypes | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<Products[number] | undefined>();
  const { isOpen, onOpenChange } = useDisclosure();
  return (
    <div className="space-y-2">
      <Modal
        isOpen={!!selected && isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelected(undefined);
          }
          onOpenChange();
        }}
        size="full"
        placement="center"
        hideCloseButton
        className="bg-transparent"
      >
        <ModalContent>
          {(onClose) => {
            return (
              <ModalBody className="relative">
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-4 top-4 z-[1] rounded-full bg-slate-100/50 p-1 transition-colors hover:bg-slate-500 hover:text-white"
                >
                  <XCircleIcon width={24} height={24} />
                </button>
                {!!selected && (
                  <Image
                    alt={selected.name}
                    src={selected.image_url}
                    loading="lazy"
                    fill
                    className="h-full w-full object-contain"
                  />
                )}
              </ModalBody>
            );
          }}
        </ModalContent>
      </Modal>
      <Swiper
        slidesPerView={1.5}
        spaceBetween={24}
        centeredSlides
        loop
        onSwiper={(e) => {
          swiperRef.current = e;
        }}
        onSlideChange={(e) => {
          setActiveIndex(e.realIndex);
        }}
        wrapperClass="min-w-0"
      >
        {products?.map((x) => {
          return (
            <SwiperSlide className="" key={x.id}>
              <div className="relative flex max-h-[400px] w-auto items-center justify-center">
                <Image
                  alt={x.name}
                  src={x.image_url}
                  width={400}
                  height={400}
                  loading="lazy"
                  className="h-full w-full object-contain"
                />

                <button
                  type="button"
                  className="absolute bottom-4 right-4 rounded-xl bg-slate-100 p-2 transition-all hover:bg-slate-500 hover:text-white"
                  onClick={() => {
                    setSelected(x);
                    onOpenChange();
                  }}
                >
                  <SearchIcon width={16} height={16} />
                </button>
                <div className="absolute left-0 top-0 max-w-[50%] rounded-br-lg bg-slate-100 px-2 py-1 font-semibold">
                  {x.name}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {!!swiperRef.current && (
        <div className="flex w-full items-center justify-center gap-1.5">
          {swiperRef.current.slides.map((_, i) => {
            return (
              <div
                className={classNames(
                  'h-2.5 w-2.5 rounded-full bg-slate-500 transition-all',
                  {
                    'bg-blue-400': activeIndex === i,
                  },
                )}
                key={i}
              ></div>
            );
          })}
        </div>
      )}
    </div>
  );
};

function ProductSection() {
  const { data } = useGetCircleBySlug();
  const { data: products, isLoading } = useGetProducts({ circleID: data?.id });
  const { isAllowed } = useIsMyCircle();

  const productsIsEmpty = !products || products.length === 0;

  return (
    <Wrapper>
      {productsIsEmpty && (
        <Fragment>
          {isAllowed ? (
            <p className="mt-2 italic text-neutral-500">
              Display your works here!
            </p>
          ) : (
            <p className="mt-2 italic text-neutral-500">
              {data?.name} hasn&apos;t set their amazing works yet.
            </p>
          )}
        </Fragment>
      )}

      <div className="flex items-center justify-center gap-6">
        {isLoading &&
          new Array(1).fill(0).map((_, i) => {
            return (
              <div
                key={i}
                className="h-[400px] w-full max-w-[542px] animate-pulse-faster bg-slate-200"
              ></div>
            );
          })}
      </div>

      {!!products && <ProductList products={products} />}
    </Wrapper>
  );
}

export default ProductSection;
