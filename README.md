# Project catalog-ui 📚

Nextjs web application for `Inner Catalog`

![logo](./public/flat-logo.png)

## Description

Inner Catalog is a platform for sharing and discovering works/doujin/comic/illustration from various creators before convention.

This is an alternatives from `comifuro` catalog but not solely for comifuro. I would gradually add more convention to the list based on your suggestion.

## Community

- Just use github discusson for now
- Should i make a discord server?

## Getting Started

### Requirements

- Node v20.9.0
- pnpm v9.2.0
- Docker
- Google Client ID (for Google OAuth2)

### Installation

1. Fork the repository
2. Clone the repository from your fork
3. Create `.env` file in the root dir based on `.env.example`
4. Setting `.next.config.mjs` add your own `images.remotePatterns`
5. Install dependencies

```bash
pnpm install
```

6. Makesure [catalog-api](https://github.com/comimafun/catalog-api) is already setup and running locally

7. Run the application

```bash
pnpm run dev
```

## Environment

- dev - development environment [https://dev.innercatalog.com](https://dev.innercatalog.com)
- prod - production environment [https://innercatalog.com](https://innercatalog.com) (later la if i have money)

## ETC

Thank you so much for visiting my repository 🥹. If you think this web is useful or have feedback, please let me know im active on discord (@pandakas) and twitter ([@varkased](https://x.com/varkased))

If you have feedback about design sense, you might notice the design
itself is shit and out of place. I have like 0 design sense so please
spare me 😭

But if there's any UI/UX student out there that wanted to use this
as their studycase, let me know and id make it real 😉
