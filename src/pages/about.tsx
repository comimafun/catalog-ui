import EachPageLayout from '@/components/general/EachPageLayout';
import React from 'react';

function AboutPage() {
  return (
    <EachPageLayout className="mb-10">
      <h1 className="my-4 text-4xl font-bold">Welcome to innercatalog</h1>
      <div className="space-y-2 text-base">
        {' '}
        <p className="text-justify">
          Inner catalog is a website where individual, circles, groups to share
          their work and found each other before convention.
        </p>
        <p>
          This is an alternative from comifuro{' '}
          <a target="_blank" href="https://catalog.comifuro.net/">
            catalog.comifuro.net
          </a>
          , but not solely for comifuro. I would gradually add more convention
          to the list based on your suggestion
        </p>
        <p>
          If you really found this page, thank you so much for visiting my web
          🥹. And if you think this web is useful or have feedback, please let
          me know on twitter/X <a href="https://x.com/varkased">@varkased</a>
        </p>
        <p>
          If you have feedback about design sense, you might notice the design
          itself is shit and out of place. I have like 0 design sense so please
          spare me 😭
        </p>
        <p>
          But if there&apos; any ui/ux student out there that wanted to use this
          as their studycase, let me know and id make it real 😉
        </p>
        <p>
          Currently i developed this web by myself but i open sourced the
          project so contributors is welcomed. Please check this out{' '}
          <a
            target="_blank"
            href="https://github.com/orgs/comimafun/repositories"
          >
            repositories
          </a>{' '}
        </p>
      </div>
    </EachPageLayout>
  );
}

export default AboutPage;
