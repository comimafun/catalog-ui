import { authService } from '@/services/auth';
import { onSuccessGoogleSchema } from '@/types/auth';
import { parseErrorMessage } from '@/utils/helper';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import React from 'react';
import toast from 'react-hot-toast';
import nookies from 'nookies';

const GoogleIcon = (props: JSX.IntrinsicElements['svg']) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24"
    viewBox="0 0 24 24"
    width="24"
    {...props}
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
    <path d="M1 1h22v22H1z" fill="none" />
  </svg>
);

const SignInWithGoogle = () => {
  const signIn = useGoogleLogin({
    flow: 'auth-code',
    ux_mode: 'popup',
    redirect_uri: 'http://localhost:3000',
    onSuccess: async (response) => {
      try {
        const parsed = onSuccessGoogleSchema.parse(response);
        const { data } = await authService.googleCallback(parsed.code);

        nookies.set(null, 'access_token', data.access_token, {
          maxAge: new Date(data.access_token_expired_at).getSeconds(),
          path: '/',
        });
      } catch (error) {
        const msg = parseErrorMessage(error as Error);
        toast.error(msg);
      }
    },
  });
  return (
    <button
      className="mt-3 flex w-full items-center justify-center gap-4 rounded-[61px] border border-neutral-500 py-2 font-bold shadow-lg active:scale-95"
      type="button"
      onClick={signIn}
    >
      <GoogleIcon />
      Sign In with Google
    </button>
  );
};

function SignInPage() {
  return (
    <main className="flex min-h-[calc(100vh-56px)] w-full items-center justify-center bg-white px-4 pt-4">
      <div className="rounded-lg border border-neutral-950 p-4 shadow-md">
        <h1 className="text-center text-xl font-bold">Sign In to Comimafun</h1>
        <p className="font-medium">
          Discover and share your circles with the world.
        </p>

        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}
        >
          <SignInWithGoogle />
        </GoogleOAuthProvider>
      </div>
    </main>
  );
}

export default SignInPage;
