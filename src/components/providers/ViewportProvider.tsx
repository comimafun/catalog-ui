import { classNames } from '@/utils/classNames';
import { useRouter } from 'next/router';
import { createContext, RefObject, useContext, useRef } from 'react';
import { ViewportListRef } from 'react-viewport-list';

export type ViewportContext = {
  viewportRef: RefObject<HTMLDivElement>;
  listRef: RefObject<ViewportListRef>;
};

const viewportContext = createContext<ViewportContext | null>(null);

export const ViewportProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<ViewportListRef>(null);

  const router = useRouter();

  return (
    <div
      className={classNames(
        'overflow-x-hidden',
        router.pathname === '/' ? 'h-screen' : '',
      )}
      ref={viewportRef}
    >
      <viewportContext.Provider
        value={{
          viewportRef,
          listRef,
        }}
      >
        {children}
      </viewportContext.Provider>
    </div>
  );
};

export const useViewport = () => {
  const ctx = useContext(viewportContext);

  if (!ctx) {
    throw new Error('useViewport must be used within a ViewportProvider');
  }

  return ctx;
};
