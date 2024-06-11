import { classNames } from '@/utils/classNames';
import { useInView } from 'framer-motion';
import Link from 'next/link';
import { ReactNode, useRef } from 'react';
import { useSession } from './providers/SessionProvider';
import { Button } from '@nextui-org/react';
import { useLogout } from '@/hooks/auth/useLogout';

const RightMenu = () => {
  const { session } = useSession();
  const { logout, isPending } = useLogout();

  return (
    <div className="flex gap-3">
      {session && (
        <Link href="/join">
          <Button size="sm" variant="solid" color="primary">
            Create your circle
          </Button>
        </Link>
      )}
      {session ? (
        <Button
          className="font-medium"
          color="secondary"
          size="sm"
          type="button"
          variant="flat"
          isLoading={isPending}
          onClick={logout}
        >
          Logout
        </Button>
      ) : (
        <Link href="/sign-in">
          <Button
            className="font-semibold"
            color="primary"
            size="sm"
            type="button"
            variant="flat"
          >
            Sign In
          </Button>
        </Link>
      )}
    </div>
  );
};

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
        <nav className="mx-auto flex max-h-[56px] w-full max-w-[640px] justify-between bg-white px-4 py-5">
          <Link href="/" className="font-bold">
            LOGO
          </Link>

          <RightMenu />
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
