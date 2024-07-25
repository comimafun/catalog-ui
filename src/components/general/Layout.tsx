import { classNames } from '@/utils/classNames';
import { useInView } from 'framer-motion';
import Link from 'next/link';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useSession } from '../providers/SessionProvider';
import { Button } from '@nextui-org/react';
import { useLogout } from '@/hooks/auth/useLogout';
import HamburgerIcon from '@/icons/HamburgerIcon';
import { useLayoutStore } from '@/store/layout';
import Logo from './Logo';
import dynamic from 'next/dynamic';
import { MAIN_NAV_LINKS } from '@/constants/common';
import { useRouter } from 'next/router';

const MenuDrawer = dynamic(() => import('./MenuDrawer'), { ssr: false });

const RightMenu = () => {
  const { session } = useSession();
  const { logout, isPending } = useLogout();
  const toggle = useLayoutStore((state) => state.toggleMenuDrawer);

  return (
    <>
      <MenuDrawer />
      <button className="sm:hidden" onClick={() => toggle()} type="button">
        <HamburgerIcon width={32} height={32} />
      </button>
      <div className="hidden gap-3 sm:flex">
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
    </>
  );
};

const ProgressBar = ({ isInView }: { isInView?: boolean }) => {
  const router = useRouter();
  const [state, setState] = useState<'' | 'start' | 'complete'>('');
  const [prevPathname, setPrevPathname] = useState(router.pathname);

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      const newPathname = url.split('?')[0];
      if (newPathname !== prevPathname) {
        setState('start');
      }
    };

    const handleRouteChangeComplete = (url: string) => {
      const newPathname = url.split('?')[0];
      if (newPathname !== prevPathname) {
        setState('complete');
        setPrevPathname(newPathname);
      }
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router.events, prevPathname]);

  useEffect(() => {
    if (state === 'complete') {
      const timer = setTimeout(() => {
        setState('');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state]);

  return (
    <div
      className={classNames(
        'h-1 w-full transition-all',
        state ? 'bg-primary' : isInView ? 'bg-primary' : 'bg-primary/70',
      )}
      style={{
        width: state === 'start' ? '20%' : state === 'complete' ? '100%' : '0%',
      }}
    ></div>
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
        <ProgressBar isInView={isInView} />
        <nav
          className={classNames(
            'mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 py-5',
            isInView ? 'bg-white' : 'bg-transparent',
          )}
        >
          <div className="flex items-center gap-8">
            <Logo />

            <ul className="hidden space-x-4 sm:flex">
              {MAIN_NAV_LINKS.map((link) => (
                <li key={link.key}>
                  <Link
                    className="font-medium underline-offset-8 transition-all hover:font-semibold hover:underline"
                    href={link.href}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <RightMenu />
        </nav>
      </div>
      <div className="pt-[76px]" />
      <div ref={ref} className="w-full"></div>
    </>
  );
};

const Footer = () => {
  return (
    <footer className="mx-auto w-full border-t border-neutral-200 bg-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col px-4 py-5">
        <Logo />
        <p className="mt-2 text-base">
          Alternative website to share your works before con.
        </p>

        <div className="mt-4 flex justify-between">
          <ul className="flex">
            <li>
              <Link className="font-bold" href="/about">
                About
              </Link>
            </li>
          </ul>

          <div>
            Created by{' '}
            <a target="_blank" href="https://github.com/althafdaa">
              @varkased
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

function MainLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen justify-between bg-slate-200 text-sm">
      <Navbar />

      <div className="mx-auto w-full max-w-[640px]">{children}</div>
      <Footer />
    </main>
  );
}

export default MainLayout;
