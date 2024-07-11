import { classNames } from '@/utils/classNames';
import { useInView } from 'framer-motion';
import Link from 'next/link';
import { ComponentProps, Fragment, ReactNode, useRef, useState } from 'react';
import { useSession } from '../providers/SessionProvider';
import { Button } from '@nextui-org/react';
import { useLogout } from '@/hooks/auth/useLogout';
import BookIcon from '@/icons/BookIcon';
import HamburgerIcon from '@/icons/HamburgerIcon';
import { Drawer, DrawerContent } from './Drawer';
import XMarkIcon from '@/icons/XMarkIcon';

const Logo = (props: Omit<ComponentProps<typeof Link>, 'href'>) => {
  return (
    <Link
      href="/"
      className="group relative flex w-min items-center overflow-hidden rounded p-1.5 font-extrabold text-[#5E17EB] ring-1 ring-[#5E17EB] transition-all hover:ring-2"
      {...props}
    >
      <div
        className={classNames(
          'absolute rounded-full bg-primary blur transition-all group-hover:bg-pink-500',
          'h-3 w-3 group-hover:h-5 group-hover:w-4',
          '-left-1 -top-1 group-hover:-left-2 group-hover:-top-2',
        )}
      />
      <div
        className={classNames(
          'absolute rounded-full bg-pink-500 blur transition-all group-hover:bg-primary',
          'h-3 w-3 group-hover:h-5 group-hover:w-4',
          '-bottom-1 -right-1 group-hover:-bottom-2 group-hover:-right-2',
        )}
      />
      <span className="relative z-[1] flex items-center justify-center gap-2">
        <BookIcon width={16} height={16} /> <div>innercatalog</div>
      </span>
    </Link>
  );
};

const RightMenu = () => {
  const { session } = useSession();
  const { logout, isPending } = useLogout();
  const [open, setOpen] = useState(true);

  return (
    <>
      <Drawer open={open} onOpenChange={setOpen} direction="top">
        <DrawerContent className="bottom-[none] top-0 mt-0 rounded-b p-4">
          <div className="flex w-full items-center justify-between">
            <Logo />{' '}
            <button type="button" onClick={() => setOpen(false)}>
              <XMarkIcon className="text-slate-300" width={32} height={32} />
            </button>
          </div>
          <h1 className="mt-4 font-bold">Links</h1>
          <ul className="mt-2">
            <li>
              <Link href="/about">About</Link>
            </li>
          </ul>
          <hr className="my-2" />

          <div className="flex w-full gap-2">
            {session ? (
              <Fragment>
                {' '}
                {!!session.circle ? (
                  <Button
                    type="button"
                    as={Link}
                    href={`/${session.circle.slug}`}
                    size="sm"
                    variant="solid"
                    color="primary"
                    className="w-full"
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
                    className="w-full"
                  >
                    Create your circle
                  </Button>
                )}
                <Button
                  className="w-full font-medium"
                  color="secondary"
                  size="sm"
                  type="button"
                  variant="flat"
                  isLoading={isPending}
                  onPress={logout}
                >
                  Logout
                </Button>
              </Fragment>
            ) : (
              <Button
                className="w-full font-semibold"
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
        </DrawerContent>
      </Drawer>
      <button
        className="sm:hidden"
        onClick={() => setOpen((prev) => !prev)}
        type="button"
      >
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
          <div className="flex items-center gap-8">
            <Logo />

            <ul className="hidden sm:block">
              <li>
                <Link
                  className="font-medium underline-offset-8 transition-all hover:font-semibold hover:underline"
                  href="/about"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          <RightMenu />
        </nav>
      </div>
      <div className="pt-[72px]" />
      <div ref={ref} className="w-full"></div>
    </>
  );
};

const Footer = () => {
  return (
    <footer className="mx-auto w-full border-t border-neutral-200 bg-white">
      <div className="mx-auto flex w-full max-w-[640px] flex-col px-4 py-5">
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
