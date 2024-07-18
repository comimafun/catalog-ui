import { DefaultSeoProps } from 'next-seo';

export const DEFAULT_SEO: DefaultSeoProps = {
  dangerouslySetAllPagesToNoFollow:
    process.env.NEXT_PUBLIC_APP_STAGE === 'development',
  dangerouslySetAllPagesToNoIndex:
    process.env.NEXT_PUBLIC_APP_STAGE === 'development',
  title: 'Share your works | Inner Catalog',
  description: 'Alternative website to share your works before con',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Inner Catalog Hub',
    description: 'Alternative website to share your works before con',
    site_name: 'Inner Catalog Hub',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
        alt: 'Inner Catalog Hub',
      },
    ],
  },
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/logo.png',
    },
    {
      rel: 'apple-touch-icon',
      href: '/logo.png',
      sizes: '180x180',
    },
  ],
};
