import EachPageLayout from '@/components/general/EachPageLayout';
import { Button } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function NotFoundPage() {
  return (
    <EachPageLayout className="flex flex-col items-center justify-center">
      <Image
        src="/assets/404.png"
        width={400}
        height={500}
        alt="NotFound 404 by SAWARATSUKI"
      />

      <p className="text-center font-semibold">
        Assets by{' '}
        <a
          className="text-primary"
          href="https://github.com/SAWARATSUKI/KawaiiLogos"
        >
          SAWARATSUKI
        </a>
      </p>

      <Button className="mt-4 font-semibold" color="primary" as={Link} href="/">
        Homepage
      </Button>
    </EachPageLayout>
  );
}

export default NotFoundPage;
