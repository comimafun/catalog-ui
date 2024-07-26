import { useRouter } from 'next/router';
import { createContext, Fragment, RefObject, useContext, useRef } from 'react';
import { ViewportListRef } from 'react-viewport-list';

export type ViewportContext = {
  viewportRef: RefObject<HTMLDivElement>;
  listRef: RefObject<ViewportListRef>;
  scrollToTop: () => void;
};

const viewportContext = createContext<ViewportContext | null>(null);

export const ViewportProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<ViewportListRef>(null);

  const scrollToTop = () => {
    viewportRef.current?.scrollTo({ top: 0, behavior: 'instant' });
  };

  const router = useRouter();
  const isHomepage = router.pathname === '/';
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    if (!isHomepage) {
      return <Fragment>{children}</Fragment>;
    }

    return (
      <div ref={viewportRef} className="h-screen overflow-x-hidden">
        {children}
      </div>
    );
  };

  return (
    <Wrapper>
      <viewportContext.Provider
        value={{
          viewportRef,
          listRef,
          scrollToTop,
        }}
      >
        {children}
      </viewportContext.Provider>
    </Wrapper>
  );
};

export const useViewport = () => {
  const ctx = useContext(viewportContext);

  if (!ctx) {
    throw new Error('useViewport must be used within a ViewportProvider');
  }

  return ctx;
};
