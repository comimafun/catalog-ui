declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_APP_STAGE: 'development' | 'production';
    NEXT_PUBLIC_API_BASE_URL?: string;
    NEXT_PUBLIC_GOOGLE_CLIENT_ID?: string;
    NEXT_PUBLIC_DOMAIN?: string;
  }
}
