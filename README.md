# HorseSharing Bishkek

Telegram-first backend for a horse rental and riding aggregator in Bishkek.

## Stack

- TypeScript + Node.js
- Fastify HTTP API
- grammY Telegram bot
- Prisma ORM 7 + PostgreSQL
- Railway-ready healthcheck and start command

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

## Environment

Create real values from `.env.example`.

- `DATABASE_URL`: PostgreSQL connection string.
- `TELEGRAM_BOT_TOKEN`: token from BotFather.
- `TELEGRAM_BOT_MODE`: `polling`, `webhook`, or `disabled`. Use `webhook` on Railway.
- `APP_URL`: public URL, required for webhook mode.
- `TELEGRAM_WEBHOOK_SECRET`: secret header value for Telegram webhook requests.
- `PAYMENTS_PROVIDER_TOKEN`: provider token from BotFather Payments.
- `MANAGER_CHAT_ID`: chat ID for new booking notifications.

## API

- `GET /health`
- `GET /api/locations`
- `GET /api/horses?locationId=...`
- `GET /api/ride-packages?locationId=...`
- `GET /api/availability?locationId=...&packageId=...`
- `POST /api/bookings`

## Telegram Commands

- `/start`: main menu
- `/book`: booking flow
- `/horses`: available horses
- `/locations`: locations and maps
- `/my`: user bookings

## Product Plan

See [product phases](docs/product-phases.md).
