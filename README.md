# blog.phamdaibang.com

Personal bilingual blog for Pham Dai Bang, built with Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, and Wisp CMS.

## Features

- Vietnamese and English sections at `/vi` and `/en`
- Wisp CMS-backed posts, tags, comments, and related posts
- RSS feed at `/rss`
- Dynamic sitemap and robots metadata
- Open Graph image generation
- Light and dark theme support

## Requirements

- Node.js 20+
- npm
- A Wisp CMS blog ID

## Environment

Copy `.env.example` to `.env.local` and fill in the values:

```bash
NEXT_PUBLIC_BLOG_ID=
NEXT_PUBLIC_BLOG_DISPLAY_NAME="Pham Dai Bang"
NEXT_PUBLIC_BLOG_COPYRIGHT="Pham Dai Bang"
NEXT_DEFAULT_METADATA_DEFAULT_TITLE="Pham Dai Bang's Writing Corner"
NEXT_PUBLIC_BLOG_DESCRIPTION="A small corner for words, reflection, and everyday observation."
NEXT_PUBLIC_BASE_URL="https://blog.phamdaibang.com"
OG_IMAGE_SECRET=
```

Use a strong random value for `OG_IMAGE_SECRET` in production.

## Development

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Content model

Language is controlled by Wisp tags:

- Add `vi` to Vietnamese posts.
- Add `en` to English posts.
- Posts without either language tag are treated as Vietnamese.

Other tags are shown publicly and used for tag pages. The language tags are hidden from readers.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```

## Deployment

The site is intended to run on Vercel. Set the same environment variables in the Vercel project settings before deploying.
