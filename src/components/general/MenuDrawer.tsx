import React, { Fragment } from 'react';
import { Drawer, DrawerContent } from './Drawer';
import Logo from './Logo';
import XMarkIcon from '@/icons/XMarkIcon';
import Link from 'next/link';
import { Button } from '@nextui-org/react';
import { useSession } from '../providers/SessionProvider';
import { useLayoutStore } from '@/store/layout';
import { useLogout } from '@/hooks/auth/useLogout';
import { MAIN_NAV_LINKS } from '@/constants/common';

function MenuDrawer() {
  const { session } = useSession();
  const open = useLayoutStore((state) => state.openMenuDrawer);
  const setOpen = useLayoutStore((state) => state.setOpenMenuDrawer);
  const { logout, isPending } = useLogout();
  const close = () => setOpen(false);

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="top">
      <DrawerContent className="bottom-[none] top-0 mt-0 rounded-b p-4">
        <div className="flex w-full items-center justify-between">
          <Logo onClick={close} />{' '}
          <button type="button" onClick={() => setOpen(false)}>
            <XMarkIcon className="text-slate-300" width={32} height={32} />
          </button>
        </div>
        <h1 className="mt-4 font-bold">Links</h1>
        <ul className="mt-2">
          {MAIN_NAV_LINKS.map((link) => {
            return (
              <li key={link.key}>
                <Link onClick={close} href={link.href}>
                  {link.name}
                </Link>
              </li>
            );
          })}
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
                  onClick={close}
                  shallow
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
                  onClick={close}
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
              onClick={close}
            >
              Sign In
            </Button>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default MenuDrawer;
