import '@/styles/globals.css';
import { NextUIProvider } from '@nextui-org/react';
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { useState } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import MainLayout from '@/components/general/Layout';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from '@/components/general/providers/SessionProvider';

const fontInter = Inter({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: 'normal',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function App({
  Component,
  pageProps,
}: AppProps & { dehydratedState: unknown }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <div className="hidden">
        <style jsx global>{`
          :root {
            --font-inter: ${fontInter.style.fontFamily};
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        `}</style>
      </div>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={pageProps.dehydratedState}>
          <ReactQueryDevtools initialIsOpen={false} />
          <NextUIProvider>
            <SessionProvider>
              <MainLayout>
                <Component {...pageProps} />
                <Toaster />
              </MainLayout>
            </SessionProvider>
          </NextUIProvider>
        </HydrationBoundary>
      </QueryClientProvider>
    </>
  );
}
