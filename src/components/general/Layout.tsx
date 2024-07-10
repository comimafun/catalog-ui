import { classNames } from '@/utils/classNames';
import { useInView } from 'framer-motion';
import Link from 'next/link';
import { ReactNode, useRef } from 'react';
import { useSession } from '../providers/SessionProvider';
import { Button } from '@nextui-org/react';
import { useLogout } from '@/hooks/auth/useLogout';
import BookIcon from '@/icons/BookIcon';

const RightMenu = () => {
  const { session } = useSession();
  const { logout, isPending } = useLogout();

  return (
    <div className="flex gap-3">
      {session ? (
        <>
          {!!session.circle ? (
            <Button
              type="button"
              as={Link}
              href={`/${session.circle.slug}`}
              size="sm"
              variant="solid"
              color="primary"
            >
              Your circle
            </Button>
          ) : (
            <Button
              type="button"
              as={Link}
              href="/join"
              size="sm"
              variant="solid"
              color="primary"
            >
              Create your circle
            </Button>
          )}

          <Button
            className="font-medium"
            color="secondary"
            size="sm"
            type="button"
            variant="flat"
            isLoading={isPending}
            onPress={logout}
          >
            Logout
          </Button>
        </>
      ) : (
        <Button
          className="font-semibold"
          href="/sign-in"
          as={Link}
          color="primary"
          size="sm"
          type="button"
          variant="flat"
          typeof="button"
        >
          Sign In
        </Button>
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
          'fixed z-10 mx-auto w-full transition-all',
          isInView ? 'bg-white shadow-none' : 'bg-white/70 shadow-lg',
        )}
      >
        <nav
          className={classNames(
            'mx-auto flex w-full max-w-[640px] items-center justify-between px-4 py-5',
            isInView ? 'bg-white' : 'bg-white/70',
          )}
        >
          <Link
            href="/"
            className="flex items-center gap-2 rounded p-1.5 font-extrabold text-[#5E17EB] ring-1 ring-[#5E17EB] transition-all hover:ring-2"
          >
            <BookIcon width={16} height={16} /> <div>innercatalog</div>
          </Link>

          <RightMenu />
        </nav>
      </div>
      <div className="pt-[72px]" />
      <div ref={ref} className="w-full"></div>
    </>
  );
};

function MainLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen justify-between bg-slate-200 text-sm">
      <Navbar />

      <div className="mx-auto w-full max-w-[640px]">{children}</div>
    </main>
  );
}

export default MainLayout;
