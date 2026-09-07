# HorseSharing Web

SEO landing for HorseSharing Bishkek.

## Local Setup

```bash
npm install
npm run dev -- --port 3001
```

The app reads source photos from `../../public/assets/landing/source-pending` during `npm run build` and copies the selected landing assets into `apps/web/public`.

## SEO Pages

- `/` is the booking-first landing page.
- `/routes/[slug]` renders static route pages from `content/landing.ts`.
- `/blog` lists search-focused guides.
- `/blog/[slug]` renders static article pages from `content/blog.ts`.
- `/sitemap.xml` includes the home page, routes, blog and articles.

## Environment

- `NEXT_PUBLIC_SITE_URL`: canonical public URL for metadata, sitemap and robots.
- `NEXT_PUBLIC_API_URL`: public API URL used by landing analytics.

In local development, analytics is disabled when `NEXT_PUBLIC_API_URL` is not
set. This prevents local page checks from polluting production numbers.

## Admin

Open `/admin/analytics` to see visits, Telegram clicks, leads and bookings.
Use the `ANALYTICS_ADMIN_TOKEN` from the API service.
