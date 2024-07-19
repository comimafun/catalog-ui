import ExtendedImage from '@/components/general/ExtendedImage';
import {
  useGetCircleBySlug,
  useIsMyCircle,
} from '@/hooks/circle/useGetCircleBySlug';
import { useGetProducts } from '@/hooks/circle/useGetProducts';
import SearchIcon from '@/icons/SearchIcon';
import XCircleIcon from '@/icons/XCircleIcon';
import { Product } from '@/types/product';
import { classNames } from '@/utils/classNames';
import {
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from '@nextui-org/react';
import Link from 'next/link';
import { Fragment, ReactNode, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import EditButton from './EditButton';
import { useRouter } from 'next/router';
import { useCirclePageStore } from '@/store/circle';
import { Autoplay } from 'swiper/modules';

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
              query: { circleSlug: data?.slug, section: 'product' },
            }}
          >
            <EditButton />
          </Link>
        )}
      </div>

      {children}
    </>
  );
};

const ModalImageViewer = ({
  products,
  onOpenChange,
}: {
  products: Array<Product>;
  onOpenChange: () => void;
}) => {
  const product = useCirclePageStore((state) => state.selectedProduct);
  const setProduct = useCirclePageStore((state) => state.setSelectedProduct);
  const router = useRouter();
  const isWorkIDExist = !!router.query.work_id;

  const deleteWorkID = () => {
    delete router.query.work_id;
    router.replace({ query: router.query }, undefined, {
      shallow: true,
    });
  };

  useEffect(() => {
    if (!isWorkIDExist) return;
    if (products.length === 0) {
      deleteWorkID();
      return;
    }

    const workID = Number(router.query.work_id);
    if (isNaN(workID)) {
      deleteWorkID();
      return;
    }

    const found = products.find((x) => x.id === Number(router.query.work_id));
    if (!found) {
      deleteWorkID();
    } else {
      setProduct(found);
    }
  }, [isWorkIDExist, products]);

  return (
    <Modal
      isOpen={isWorkIDExist && !!product}
      onOpenChange={(open) => {
        if (!open) {
          deleteWorkID();
          setProduct(null);
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
              {!!product && (
                <ExtendedImage
                  alt={product.name}
                  src={product.image_url}
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
  );
};

const ProductList = ({ products }: { products: Array<Product> }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const setProduct = useCirclePageStore((state) => state.setSelectedProduct);
  const { onOpenChange } = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    return () => {
      setProduct(null);
    };
  }, []);

  return (
    <div className="space-y-2">
      <ModalImageViewer onOpenChange={onOpenChange} products={products} />
      <Swiper
        slidesPerView={1.5}
        spaceBetween={24}
        centeredSlides
        onSlideChange={(e) => {
          setActiveIndex(e.realIndex);
        }}
        wrapperClass="min-w-0"
        modules={[Autoplay]}
        autoplay={{
          delay: 5000,
        }}
        initialSlide={1}
      >
        {products?.map((x) => {
          return (
            <SwiperSlide key={x.id}>
              <div className="relative flex max-h-[200px] w-auto items-center justify-center sm:max-h-[400px]">
                <ExtendedImage
                  alt={x.name}
                  src={x.image_url}
                  width={400}
                  height={400}
                  loading="lazy"
                  className="h-full w-full object-contain"
                  placeholder="empty"
                />

                <Link
                  href={{
                    query: {
                      ...router.query,
                      work_id: x.id,
                    },
                  }}
                  className="absolute bottom-4 right-4 rounded-xl bg-slate-100 p-2 transition-all hover:bg-slate-500 hover:text-white"
                  onClick={() => {
                    setProduct(x);
                    onOpenChange();
                  }}
                  shallow
                >
                  <SearchIcon width={16} height={16} />
                </Link>
                <div className="absolute left-0 top-0 max-w-[50%] rounded-br-lg bg-slate-100 px-2 py-1 text-[10px] font-semibold md:text-sm">
                  {x.name}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {products.length > 1 && (
        <div className="flex w-full items-center justify-center gap-1.5">
          {products.map((_, i) => {
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
