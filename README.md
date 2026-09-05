# HorseSharing Bishkek

Telegram-first backend for a horse rental and riding aggregator in Bishkek.

## Stack

- TypeScript + Node.js
- Fastify HTTP API
- grammY Telegram bot
- Prisma ORM 7 + PostgreSQL
- Railway-ready healthcheck and start command
- Next.js landing app in `apps/web`

## Local Setup

```bash
npm install
docker compose up -d
npm run db:generate
npm run db:migrate -- --name init
npm run db:seed
npm run dev
```

The API listens on `http://localhost:3000`.

## Web Landing

```bash
cd apps/web
npm install
npm run dev -- --port 3001
npm run build
```

Set `NEXT_PUBLIC_SITE_URL` to the production landing domain before deployment.
Set `NEXT_PUBLIC_API_URL` to the production API URL so landing analytics events
are written to the backend.

## Environment

Create real values from `.env.example`.

- `DATABASE_URL`: PostgreSQL connection string.
- `TELEGRAM_BOT_TOKEN`: token from BotFather.
- `TELEGRAM_BOT_MODE`: `polling`, `webhook`, or `disabled`. Use `webhook` on Railway.
- `APP_URL`: public URL, required for webhook mode.
- `TELEGRAM_WEBHOOK_SECRET`: secret header value for Telegram webhook requests.
- `PAYMENTS_PROVIDER_TOKEN`: provider token from BotFather Payments.
- `MANAGER_CHAT_ID`: chat ID for new booking notifications.
- `ANALYTICS_ADMIN_TOKEN`: optional token for `GET /api/analytics/summary`.

## API

- `GET /health`
- `GET /api/locations`
- `GET /api/horses?locationId=...`
- `GET /api/ride-packages?locationId=...`
- `GET /api/availability?locationId=...&packageId=...`
- `POST /api/bookings`
- `POST /api/analytics/events`
- `POST /api/analytics/clicks`
- `GET /api/analytics/summary`

## Telegram Commands

- `/start`: main menu
- `/book`: booking flow
- `/horses`: available horses
- `/locations`: locations and maps
- `/my`: user bookings
- `/stats`: manager-only 30-day source, lead and booking report

## Analytics

The landing page keeps UTM labels and creates a short Telegram `clickId` before
opening the bot. The bot receives `/start hs_...`, resolves the original source,
and attaches it to lead and booking events.

- Admin page: `/admin/analytics`
- A lead means the customer left a phone number.
- A booking means the lead was saved as a booking.
- `GET /api/analytics/summary` requires `ANALYTICS_ADMIN_TOKEN` when it is set.

## Product Plan

See [product phases](docs/product-phases.md).
