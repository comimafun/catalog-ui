export const MEGABYTE = 1024 * 1024;
export const FIVE_MB = 5 * MEGABYTE;
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
];

export const ACCEPTED_IMAGE_TYPES_SET = new Set(ACCEPTED_IMAGE_TYPES);

export const MAIN_NAV_LINKS = [
  {
    name: 'Bookmark',
    href: '/bookmark',
    key: 'bookmark',
  },
  {
    name: 'About',
    href: '/about',
    key: 'about',
  },
] as const;

export const RATING_METADATA = {
  M: 'Mature',
  PG: 'Parental Guidance',
  GA: 'General',
};
