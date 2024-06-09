import { classNames } from '@/utils/cn';
import { useInView } from 'framer-motion';
import Link from 'next/link';
import React, { ReactNode, useRef } from 'react';

const Navbar = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);

  return (
    <>
      <div
        className={classNames(
          'fixed mx-auto w-full bg-white transition-all',
          isInView ? 'shadow-none' : 'shadow-lg',
        )}
      >
        <nav className="mx-auto flex w-full max-w-[640px] justify-between bg-white px-4 py-5">
          <div className="font-bold">LOGO</div>
          <Link href="/sign-in">Sign In</Link>
        </nav>
      </div>
      <div className="pt-[56px]" />
      <div ref={ref} className="w-full"></div>
    </>
  );
};

function MainLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen justify-between bg-slate-200">
      <Navbar />

      <div className="mx-auto w-full max-w-[640px]">{children}</div>
    </main>
  );
}

export default MainLayout;
