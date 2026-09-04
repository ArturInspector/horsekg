# HorseSharing Web

SEO landing for HorseSharing Bishkek.

## Local Setup

```bash
npm install
npm run dev -- --port 3001
```

The app reads source photos from `../../public/assets/landing/source-pending` during `npm run build` and copies the selected landing assets into `apps/web/public`.

## Environment

- `NEXT_PUBLIC_SITE_URL`: canonical public URL for metadata, sitemap and robots.
- `NEXT_PUBLIC_API_URL`: public API URL used by landing analytics.
