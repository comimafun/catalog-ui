import EachPageLayout from '@/components/general/EachPageLayout';
import { useSession } from '@/components/providers/SessionProvider';
import { useGetCircleBySlug } from '@/hooks/circle/useGetCircleBySlug';
import Link from 'next/link';
import React from 'react';

function Referral() {
  const { session } = useSession();
  const { data } = useGetCircleBySlug({
    slug: session?.circle?.slug,
  });

  const APP_STAGE = process.env.NEXT_PUBLIC_APP_STAGE;
  return (
    <EachPageLayout className="mb-10 pb-10">
      <h1 className="text-4xl font-bold">
        Hai{!!data?.name ? `, ${data.name}!` : '!'}
      </h1>

      {APP_STAGE === 'development' && (
        <div className="my-2 rounded bg-slate-100 px-4 py-2 font-medium">
          This is a development/testing environment. And this campaign is
          something that will work in the future if there&apos;s ever one😅. If
          you have something in mind about this kind of campaign, also let me
          know!
        </div>
      )}

      <div className="space-y-2 text-base">
        <h2 className="text-2xl font-semibold">Referral System</h2>
        <p>
          If you reached this page you and i might have same goal, more reach!
          <br />
          You want people to know about your circle and i want more people to
          know about innercatalog. So why dont we help each other?
        </p>

        <h3 className="text-xl font-medium">How?</h3>
        <ol className="ml-4 list-decimal">
          <li>
            First make sure you&apos;re already created a circle in inner
            catalog, if not you can join{' '}
            <Link href="/" className="font-medium text-primary">
              here
            </Link>
          </li>

          <li>
            Message me on{' '}
            <a
              href="https://x.com/varkased"
              className="font-medium text-primary"
            >
              Twitter
            </a>{' '}
            or Discord (@pandakas) to generate your code
          </li>

          <li>
            Sent me your registered email, circle link, and requested code (if
            you want a custom code)
          </li>

          <li>
            Once code is generated, you&apos; be able to see your code in your
            circle profile,{' '}
            <span className="font-medium">
              top right of your screen (three dots)
            </span>
          </li>

          <li>Share code/registration link from your page to your friends</li>

          <li>
            Once there is 5 circle that joined innercatalog with your referral
            and <b>published</b>, you&apos;re eligible to get displayed! Just
            contact me ✅
          </li>
        </ol>

        <h3 className="text-xl font-medium">Display Benefit/Terms</h3>
        <ul className="ml-4 list-disc">
          <li>
            Banner design is coming from you, link click through display can be
            customized to your designated link (or circle profile by default)
          </li>

          <li>
            Displayed for 1 week, and will be rotated with other referral circle
          </li>

          <li>You can pick the date yourself!</li>
          <li>Minimum date range for display is 1 week</li>
        </ul>

        <h4 className="text-lg font-medium">For Early Adopters</h4>
        <p>
          I highly appreciate early adopters and would like to give you extra
          thanks so
        </p>
        <p>
          <b>First to fifth</b> circle who reached referral limit would be
          eligible for extra display time
        </p>
        <ul className="ml-4 list-disc">
          <li>1st: Extra 3 weeks</li>
          <li>2nd,3rd: Extra 2 weeks</li>
          <li>4th,5th: Extra 1 week</li>
        </ul>
      </div>
    </EachPageLayout>
  );
}

export default Referral;
