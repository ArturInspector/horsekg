# HorseSharing: технический аудит и архитектура codebase v2

Дата аудита: 2026-09-07.

Цель документа: описать, что в текущей кодовой базе уже работает как MVP, где она ограничена уровнем микробизнеса, и как перевести проект к production-grade архитектуре без резкого переписывания всего продукта.

## 1. Текущее состояние

Проект сейчас состоит из двух частей:

- backend в корне репозитория: TypeScript, Fastify, grammY, Prisma, PostgreSQL;
- web в `apps/web`: Next.js лендинг, клиентская аналитика и простая страница отчета.

Ключевые файлы backend:

- `src/main.ts` - точка входа: читает конфиг, создает Telegram-бота, создает Fastify-сервер, настраивает webhook или polling, закрывает соединения при shutdown.
- `src/http/server.ts` - все HTTP-роуты, Zod-валидация, CORS, обработка ошибок, Telegram webhook.
- `src/bot/index.ts` - весь Telegram bot-flow: меню, запись, выбор локации/маршрута/слота/лошади, телефон, оплата, менеджерские уведомления, `/stats`.
- `src/services/catalog.ts` - чтение локаций, лошадей, пакетов и доступных слотов.
- `src/services/bookings.ts` - создание брони, увеличение `seatsBooked`, создание клиента и платежа.
- `src/services/payments.ts` - Telegram invoice и отметка успешной оплаты.
- `src/services/analytics.ts` - сбор маркетинговых событий, генерация `clickId`, связывание с ботом, агрегированный отчет.
- `src/bot/session-storage.ts` - хранение grammY-сессии в таблице `TelegramSession`.
- `src/config.ts` - env-схема через Zod.
- `prisma/schema.prisma` - вся доменная модель базы.
- `prisma/seed.ts` - демо-данные: локации, маршруты, лошади, слоты.

Ключевые файлы web:

- `apps/web/app/page.tsx` - лендинг из статического контента.
- `apps/web/content/landing.ts` - тексты, маршруты, SEO-данные, ссылки на Telegram.
- `apps/web/app/analytics-tracker.tsx` - клиентский трекинг page view и Telegram click.
- `apps/web/lib/analytics.ts` - URL API для аналитики.
- `apps/web/app/admin/analytics/analytics-admin.tsx` - простая админ-страница аналитики.

Существующая Prisma-модель:

- каталог: `Location`, `Horse`, `RidePackage`, `AvailabilitySlot`;
- клиент и бронь: `Customer`, `Booking`;
- оплата: `Payment`;
- Telegram-сессии: `TelegramSession`;
- аналитика: `MarketingClick`, `AnalyticsEvent`.

Что уже сделано хорошо для MVP:

- есть минимальная транзакционная защита от переполнения слота в `src/services/bookings.ts`;
- Fastify API валидирует входные данные через Zod в `src/http/server.ts`;
- Telegram bot-flow доводит пользователя до брони;
- аналитика V2 уже связывает лендинг, deep link в Telegram и события бота через `clickId`;
- конфигурация централизована в `src/config.ts`;
- есть Prisma migrations и seed;
- Next.js лендинг отделен от backend в `apps/web`.

## 2. Где проект сейчас остается MVP/микробизнесом

### 2.1. Один оператор вместо ролевой системы

Сейчас управление завязано на `MANAGER_CHAT_ID`:

- бот отправляет новые брони в один чат;
- `/stats` доступен только этому чату;
- web-админка аналитики защищена одним `ANALYTICS_ADMIN_TOKEN`.

Это нормально для микробизнеса, где один менеджер вручную подтверждает заявки. Для marketplace или агрегатора нужна модель пользователей, ролей и прав доступа.

### 2.2. Нет доменной сущности поставщика

В базе есть `Location`, `Horse`, `RidePackage`, но нет `Provider` или `Owner`.

Из-за этого нельзя нормально ответить на вопросы:

- кому принадлежит лошадь;
- какой провайдер отвечает за слот;
- кто получает деньги;
- кто может редактировать конкретную локацию;
- какие комиссии и правила отмены применяются;
- какой SLA у провайдера по подтверждению брони.

### 2.3. Бронь похожа на заявку, а не на полный production booking

`BookingStatus` уже содержит `PENDING_PAYMENT`, `PENDING_CONFIRMATION`, `CONFIRMED`, `CANCELLED`, `EXPIRED`, но жизненный цикл еще не оформлен как state machine.

Главные пробелы:

- `BOOKING_HOLD_MINUTES` есть в `src/config.ts`, но не используется для истечения брони;
- при создании брони сразу увеличивается `AvailabilitySlot.seatsBooked`, но нет фонового освобождения мест;
- нет `expiresAt`, `cancelledAt`, `confirmedAt`, `statusReason`;
- нет истории статусов;
- нет идемпотентности для повторной отправки формы/бот-события;
- нет явного разделения hold, lead и confirmed booking.

### 2.4. Оплата минимальная

`src/services/payments.ts` умеет подготовить Telegram invoice и отметить `successful_payment`.

Для production не хватает:

- проверки суммы и валюты на `pre_checkout_query`;
- идемпотентной обработки повторных Telegram payment updates;
- отдельной таблицы платежных событий;
- refund/cancel/reconciliation процесса;
- платежных провайдеров вне Telegram;
- payout/commission учета для провайдеров;
- ручной оплаты и payment link как полноценных сценариев.

### 2.5. API - внутренний, а не публичный контракт

В `src/http/server.ts` схемы Zod лежат рядом с роутами. Это быстро и удобно, но контракт не переиспользуется в `apps/web`, боте и будущей админке.

Проблемы:

- нет версионирования `/api/v1`;
- нет OpenAPI/SDK;
- Prisma-формы ответа могут протекать наружу;
- нет стабильной error envelope;
- нет request id в ответах и логах;
- нет pagination/cursor стандарта;
- нет rate limit;
- `CORS origin: true` подходит для разработки, но не для production.

### 2.6. Аналитика V2 работает, но смешивает уровни

`src/services/analytics.ts` одновременно:

- чистит входные параметры;
- создает click id;
- пишет события;
- ищет attribution;
- агрегирует отчет;
- хранит русские labels для отчета.

Для MVP это удобно. Для роста это станет трудно тестировать и расширять: рекламные события, бизнес-события, UI labels, rollups и приватность должны жить в разных слоях.

### 2.7. Web пока лендинг, не web-продукт

`apps/web` сейчас:

- статический лендинг;
- клиентский трекер;
- token-based analytics admin.

Нет клиентского booking UI, provider/admin кабинета, server actions/API proxy, shared contracts, auth session, SSR data fetching из backend.

Отдельный риск: `apps/web/lib/analytics.ts` содержит hardcoded fallback на production Railway API. Для production-grade это должно быть явной ошибкой конфигурации или окружением preview/prod, а не скрытым fallback.

### 2.8. Тестовая база слабая

Сейчас есть тесты для `DomainError` и date helpers. Нет тестов на:

- конкурентное бронирование;
- создание booking/payment в транзакции;
- Telegram conversation flow;
- HTTP API;
- analytics attribution;
- migrations;
- web admin.

### 2.9. Observability и безопасность минимальные

Есть Fastify logger и `console.error`, но нет:

- readiness healthcheck с проверкой Postgres;
- request id/correlation id;
- метрик;
- tracing;
- error tracking;
- alerting;
- audit log;
- redaction PII в логах;
- rate limiting и anti-spam;
- backup/restore runbook.

## 3. Целевая архитектура v2

Главная идея v2: оставить текущий стек, но разделить продукт по доменным модулям и контрактам. Не надо сразу переписывать Fastify, grammY, Prisma или Next.js. Надо убрать ситуацию, когда один файл знает слишком много.

Рекомендуемая структура:

```text
apps/
  api/
    src/
      app.ts
      main.ts
      config/
      platform/
        db/
        http/
        telegram/
        queue/
        observability/
      modules/
        catalog/
        booking/
        provider/
        owner/
        analytics/
        content/
        payments/
        notifications/
      jobs/
      shared/
  web/
    app/
    components/
    features/
    lib/
packages/
  contracts/
  domain/
  db/
prisma/
  schema.prisma
  migrations/
docs/
```

Если перенос backend в `apps/api` слишком большой для первого шага, можно начать мягче:

```text
src/
  app.ts
  main.ts
  config/
  platform/
  modules/
  jobs/
  shared/
```

Важно не место папки, а правило: каждый модуль владеет своей доменной логикой, своими контрактами, своими route handlers и своими repository-запросами.

## 4. Модули v2

### 4.1. `catalog`

Отвечает за то, что можно купить или забронировать.

Текущая база:

- `Location`;
- `Horse`;
- `RidePackage`;
- `AvailabilitySlot`.

Что добавить:

- `Experience` или `Route` - продуктовый маршрут, например "Чункурчак 1 час";
- `PackageOption` - вариант цены/длительности/участников;
- `MediaAsset` - фото, источник, права использования, alt text;
- `ScheduleRule` - регулярное расписание;
- `AvailabilityException` - закрытые даты, погода, отпуск, ручной блок;
- `CatalogStatus` - draft/published/archived.

Границы модуля:

- public catalog API;
- admin CRUD для локаций, маршрутов, лошадей, фото;
- расчет видимой доступности;
- SEO-данные для страниц маршрутов.

Файлы v2:

- `src/modules/catalog/domain/*`;
- `src/modules/catalog/application/list-catalog.ts`;
- `src/modules/catalog/application/search-availability.ts`;
- `src/modules/catalog/infrastructure/catalog.repository.prisma.ts`;
- `src/modules/catalog/http/catalog.routes.ts`.

### 4.2. `booking`

Отвечает за заявку, hold мест, подтверждение, отмену и историю.

Текущая база:

- `Booking`;
- `Customer`;
- поле `AvailabilitySlot.seatsBooked`.

Что добавить:

- `BookingHold` или поля `holdExpiresAt`, `heldSeats`;
- `BookingStatusHistory`;
- `BookingParticipant`;
- `BookingAssignment` - назначенная лошадь, инструктор, провайдер;
- `BookingCancellation`;
- `IdempotencyKey`;
- `CustomerConsent` для обработки телефона и маркетинга.

Правила:

- создание брони всегда идет через application service;
- переходы статусов только через state machine;
- hold истекает по cron/job;
- при cancel/expire места освобождаются;
- повторный POST с тем же idempotency key возвращает тот же результат;
- slot capacity меняется атомарно.

Файлы v2:

- `src/modules/booking/domain/booking.ts`;
- `src/modules/booking/domain/booking-status.ts`;
- `src/modules/booking/application/create-booking.ts`;
- `src/modules/booking/application/confirm-booking.ts`;
- `src/modules/booking/application/cancel-booking.ts`;
- `src/modules/booking/application/expire-booking-holds.ts`;
- `src/modules/booking/infrastructure/booking.repository.prisma.ts`;
- `src/modules/booking/http/booking.routes.ts`.

### 4.3. `provider`

Отвечает за конные клубы, частных организаторов, их расписание, выплаты и SLA.

Новые сущности:

- `Provider`;
- `ProviderLocation`;
- `ProviderUser`;
- `ProviderContact`;
- `ProviderPayoutAccount`;
- `ProviderCommissionRule`;
- `ProviderSlaMetric`;
- `ProviderDocument`.

Что должно быть в модуле:

- onboarding поставщика;
- статусы provider: draft/active/suspended/archived;
- привязка provider к локациям, маршрутам, лошадям и слотам;
- права provider staff;
- правила комиссии и выплат;
- подтверждение/отклонение брони;
- SLA по времени ответа, отменам, no-show.

Файлы v2:

- `src/modules/provider/domain/provider.ts`;
- `src/modules/provider/application/onboard-provider.ts`;
- `src/modules/provider/application/update-provider-catalog.ts`;
- `src/modules/provider/application/confirm-provider-booking.ts`;
- `src/modules/provider/http/provider-admin.routes.ts`.

### 4.4. `owner`

Owner - это оператор платформы HorseSharing, не владелец каждой лошади.

Новые сущности:

- `User`;
- `Role`;
- `Permission`;
- `Membership`;
- `AuditLog`;
- `AdminAction`.

Роли owner:

- `OWNER_ADMIN` - полный доступ;
- `OWNER_MANAGER` - брони, клиенты, ручные подтверждения;
- `OWNER_CONTENT` - контент, фото, SEO;
- `OWNER_ANALYST` - отчеты без доступа к лишним PII;
- `SUPPORT` - просмотр и комментарии по обращениям.

Что заменить:

- `MANAGER_CHAT_ID` оставить только как notification target;
- доступ к `/stats` и web-админке перевести на нормальную auth/RBAC модель.

Файлы v2:

- `src/modules/owner/domain/rbac.ts`;
- `src/modules/owner/application/check-permission.ts`;
- `src/modules/owner/application/write-audit-log.ts`;
- `src/modules/owner/http/admin-auth.routes.ts`;
- `src/modules/owner/http/owner-admin.routes.ts`.

### 4.5. `analytics`

Текущая аналитика V2 полезна: она уже умеет связывать сайт и Telegram. В v2 ее нужно сделать надежной и дешевой для отчетов.

Разделить на слои:

- ingestion: прием событий;
- attribution: нормализация UTM/clickId/source;
- event store: запись сырых событий;
- business events: lead/booking/payment/refund;
- rollups: предагрегация по дням, источникам, кампаниям, кнопкам;
- reporting API: быстрые отчеты для UI;
- presentation labels: русские названия источников/кнопок отдельно от core-сервиса.

Что добавить:

- `AnalyticsEvent` оставить как сырое событие, но добавить `schemaVersion`;
- `ConversionEvent` или `BusinessEvent`;
- `DailyAnalyticsRollup`;
- retention policy;
- bot/web identity stitching;
- дедупликацию событий;
- async ingestion через очередь, если трафик вырастет.

Файлы v2:

- `src/modules/analytics/application/track-event.ts`;
- `src/modules/analytics/application/create-telegram-click.ts`;
- `src/modules/analytics/application/build-summary.ts`;
- `src/modules/analytics/application/rollup-daily-analytics.ts`;
- `src/modules/analytics/infrastructure/analytics.repository.prisma.ts`;
- `src/modules/analytics/http/analytics.routes.ts`.

### 4.6. `content`

Контент сейчас лежит в `apps/web/content/landing.ts`. Это быстро, но владелец бизнеса не сможет менять маршруты, FAQ и фото без релиза.

Что добавить:

- `ContentPage`;
- `SeoMetadata`;
- `FaqItem`;
- `LandingSection`;
- `MediaAsset`;
- `Redirect`;
- preview/published состояние.

Как развивать:

- на первом этапе оставить content-as-code, но вынести типы и валидаторы;
- потом добавить owner admin для маршрутов, FAQ, SEO;
- для публичных страниц использовать published snapshots;
- изображения хранить не в `source-pending`, а в управляемом bucket/CDN с полями copyright/source.

Файлы v2:

- `src/modules/content/*`;
- `apps/web/features/content/*`;
- `apps/web/features/catalog/*`.

### 4.7. `payments`

Отвечает за платежные намерения, попытки оплаты, webhooks, refunds, reconciliation.

Текущая база:

- `Payment` один-к-одному с `Booking`.

Что добавить:

- `PaymentIntent`;
- `PaymentAttempt`;
- `PaymentEvent`;
- `Refund`;
- `Payout`;
- `ProviderBalanceTransaction`;
- `PaymentProviderAccount`.

Правила:

- invoice нельзя создавать напрямую из booking без PaymentIntent;
- `pre_checkout_query` должен сверять payload, booking status, amount и currency;
- `successful_payment` обрабатывается идемпотентно;
- каждое внешнее событие сохраняется в `PaymentEvent`;
- изменение booking status идет через booking module, а не прямым update из payment service;
- manual payment и payment link должны быть такими же первоклассными провайдерами, как Telegram.

Файлы v2:

- `src/modules/payments/domain/payment-state.ts`;
- `src/modules/payments/application/create-payment-intent.ts`;
- `src/modules/payments/application/handle-telegram-precheckout.ts`;
- `src/modules/payments/application/handle-telegram-successful-payment.ts`;
- `src/modules/payments/application/refund-payment.ts`;
- `src/modules/payments/infrastructure/payment.repository.prisma.ts`.

## 5. API contracts

Сделать один источник правды для контрактов:

```text
packages/contracts/
  src/
    common.ts
    catalog.ts
    booking.ts
    provider.ts
    owner.ts
    analytics.ts
    payments.ts
```

Подход:

- Zod-схемы остаются, но переезжают из `src/http/server.ts` в `packages/contracts`;
- Fastify использует эти схемы для validation/serialization;
- web и bot используют те же TypeScript-типы;
- генерируется OpenAPI для внешней интеграции и ручного тестирования;
- все публичные endpoint версионируются через `/api/v1`.

Базовые правила API:

- даты только ISO 8601 в UTC;
- деньги в minor units или явно `amountKgs`, без float;
- публичные id не должны раскрывать внутреннюю структуру;
- POST/PUT/PATCH для booking/payment/admin действий принимают `Idempotency-Key`;
- ошибки возвращаются в едином формате:

```json
{
  "error": {
    "code": "SLOT_FULL",
    "message": "На это время мест уже нет",
    "details": {},
    "requestId": "req_..."
  }
}
```

Предлагаемые endpoint v2:

```text
GET  /api/v1/catalog/locations
GET  /api/v1/catalog/routes
GET  /api/v1/catalog/routes/:routeId
GET  /api/v1/catalog/availability?routeId=&from=&to=&participants=

POST /api/v1/leads
POST /api/v1/bookings
GET  /api/v1/bookings/:publicCode
POST /api/v1/bookings/:bookingId/cancel
POST /api/v1/bookings/:bookingId/confirm

POST /api/v1/payments/intents
POST /api/v1/payments/telegram/precheckout
POST /api/v1/payments/telegram/success
POST /api/v1/payments/:paymentId/refund

POST /api/v1/analytics/events
POST /api/v1/analytics/clicks
GET  /api/v1/analytics/summary

GET  /api/v1/admin/bookings
GET  /api/v1/admin/providers
GET  /api/v1/admin/catalog/routes
GET  /api/v1/admin/audit-log
```

## 6. Роли и доступы

Минимальная production RBAC-модель:

```text
User
  id
  email?
  telegramId?
  phone?
  status

Membership
  userId
  scopeType: PLATFORM | PROVIDER
  scopeId
  role
```

Роли платформы:

- `OWNER_ADMIN` - все настройки, роли, платежи, провайдеры;
- `OWNER_MANAGER` - брони, клиенты, ручные подтверждения, возвраты по разрешению;
- `OWNER_CONTENT` - страницы, FAQ, фото, SEO;
- `OWNER_ANALYST` - отчеты, без полного телефона клиента;
- `SUPPORT` - просмотр брони и комментарии, без финансовых операций.

Роли провайдера:

- `PROVIDER_OWNER` - настройки провайдера, сотрудники, выплаты;
- `PROVIDER_MANAGER` - расписание, слоты, подтверждение брони;
- `PROVIDER_STAFF` - просмотр назначенных прогулок;
- `PROVIDER_READONLY` - только чтение.

Клиент:

- Telegram user;
- web user в будущем;
- доступ только к своим бронированиям через signed link, Telegram identity или auth session.

Важно: `MANAGER_CHAT_ID` не должен быть моделью безопасности. Это только канал уведомлений.

## 7. Админка v2

Текущая `apps/web/app/admin/analytics` полезна как первый отчет, но production admin должна стать отдельным рабочим интерфейсом.

Разделы owner admin:

- брони: список, календарь, фильтры, смена статуса, комментарии, история;
- слоты: календарь доступности, ручные блокировки, массовое создание;
- провайдеры: карточки, контакты, активность, SLA, документы;
- каталог: маршруты, цены, лошади, фото, публикация;
- клиенты: контакты, история, согласия, заявки;
- платежи: платежи, возвраты, расхождения, выгрузки;
- аналитика: funnel, источники, кампании, route-level conversion, provider conversion;
- контент: лендинг, SEO-страницы, FAQ, редиректы;
- audit log: кто и что поменял.

Разделы provider admin:

- входящие брони;
- расписание и capacity;
- подтверждение/отмена;
- список прогулок на сегодня;
- выплаты и комиссия;
- профиль провайдера.

Технически:

- Next.js admin может жить в `apps/web/app/admin`;
- нужен server-side auth, не только localStorage token;
- backend admin API должен проверять RBAC на каждом действии;
- audit log обязателен для booking/payment/catalog изменений.

## 8. Очереди и cron

На Railway можно начать с отдельного worker service на той же codebase.

Рекомендуемый минимальный стек:

- `pg-boss` или аналогичная Postgres-backed очередь, чтобы не добавлять Redis сразу;
- отдельный процесс `worker`;
- advisory locks или queue locks, чтобы job не выполнялась в двух репликах;
- cron-trigger через Railway cron или встроенный scheduler только в одном worker.

Jobs v2:

- `booking.expire_holds` - каждые 1-5 минут освобождать места по истекшим hold;
- `booking.remind_customer` - напоминание клиенту;
- `booking.remind_provider` - напоминание провайдеру;
- `payments.reconcile` - сверять pending/succeeded/refunded;
- `analytics.rollup_daily` - строить дневные агрегаты;
- `notifications.send` - Telegram/SMS/email уведомления с retry;
- `content.revalidate` - пересборка/инвалидация страниц;
- `provider.sla_snapshot` - ежедневный расчет SLA.

Граница:

- HTTP request не должен ждать уведомления менеджеру или тяжелый отчет;
- критичные изменения в БД пишутся синхронно;
- побочные эффекты отправляются через outbox/queue.

## 9. Observability

Минимум для production:

- `requestId` на каждый HTTP-запрос;
- structured logs через pino/Fastify logger;
- redaction телефона, Telegram id, payment payload в логах;
- health endpoints:
  - `/health/live` - процесс жив;
  - `/health/ready` - есть соединение с Postgres и worker dependencies;
- error tracking, например Sentry;
- OpenTelemetry traces для HTTP, Prisma, queue jobs;
- metrics endpoint или push-метрики:
  - booking_created_total;
  - booking_confirmed_total;
  - booking_expired_total;
  - payment_succeeded_total;
  - payment_failed_total;
  - telegram_update_errors_total;
  - analytics_ingest_errors_total;
  - slot_full_total;
- alerting:
  - API 5xx выше порога;
  - платеж прошел, а booking не подтвердился;
  - очередь не обрабатывается;
  - Telegram webhook начал получать 401/5xx;
  - база близка к лимитам Railway.

## 10. Security

Что исправить до production:

- CORS whitelist вместо `origin: true`;
- обязательный `TELEGRAM_WEBHOOK_SECRET` в production webhook mode;
- rate limit на `/api/bookings`, `/api/analytics/events`, `/api/analytics/clicks`;
- anti-spam для Telegram booking flow;
- admin auth вместо одного analytics token;
- RBAC на уровне backend, не только UI;
- secure cookies для admin session;
- CSRF-защита для cookie-based admin actions;
- strict validation response serialization;
- CSP/security headers в Next.js;
- запрет hardcoded production API fallback в web;
- PII redaction в логах;
- политика хранения телефонов и Telegram данных;
- backup/restore процедура для Postgres;
- отдельные Railway env для production/preview/development;
- least-privilege DB user для runtime, отдельный user для migrations;
- audit log для всех изменений брони, слотов, платежей, ролей и контента.

## 11. Миграции данных

Текущие migrations уже есть в `prisma/migrations`. Для v2 не стоит переписывать старые миграции, если база уже развернута. Нужно добавлять новые миграции поверх.

Правила миграций:

- expand/contract вместо резких breaking changes;
- сначала добавить nullable columns/tables;
- затем backfill;
- затем включить dual-write или compatibility read;
- затем переключить код;
- потом удалить старые поля отдельной миграцией;
- каждую миграцию проверять на копии production backup;
- seed разделить на demo seed и production bootstrap.

Предлагаемый порядок DB-изменений:

1. Добавить `Provider`, `User`, `Membership`, `AuditLog`.
2. Привязать существующие `Location`, `Horse`, `RidePackage`, `AvailabilitySlot` к default provider.
3. Добавить поля booking lifecycle: `holdExpiresAt`, `confirmedAt`, `cancelledAt`, `expiredAt`, `statusReason`.
4. Добавить `BookingStatusHistory`.
5. Добавить `PaymentIntent`, `PaymentAttempt`, `PaymentEvent`.
6. Добавить analytics `schemaVersion`, `dedupeKey`, rollup tables.
7. Добавить content/media tables.
8. После перехода API удалить или законсервировать устаревшие поля.

## 12. Тестовая стратегия

Минимальный набор v2:

- unit tests:
  - booking status machine;
  - slot capacity calculator;
  - price calculation;
  - payment amount validation;
  - attribution normalization;
- integration tests:
  - `POST /api/v1/bookings` создает booking, customer, hold/payment intent;
  - конкурентные брони не превышают capacity;
  - cancel/expire освобождает места;
  - Telegram successful payment подтверждает booking один раз;
  - analytics click связывается с bot start, lead и booking;
- contract tests:
  - OpenAPI snapshots;
  - Zod schema compatibility для web и backend;
- bot tests:
  - `/start`;
  - `/book` happy path;
  - ручной телефон;
  - payment flow;
  - manager-only commands;
- web tests:
  - лендинг отправляет page view;
  - Telegram CTA получает `clickId`;
  - admin auth;
  - analytics report rendering;
- migration tests:
  - новая база поднимается с нуля;
  - старая база мигрирует до последней версии;
  - seed не ломает production data.

Инструменты:

- Vitest оставить;
- добавить test database на Postgres;
- для HTTP использовать Fastify inject;
- для web - Playwright;
- для Prisma migrations - отдельный CI job.

## 13. Deployment на Railway

Сейчас README описывает Railway-ready подход, но в репозитории нет явного `railway.json`, `Dockerfile` или другого deploy manifest.

Для v2 лучше иметь воспроизводимый deploy:

- service `api`: `npm run build && npm run start`;
- service `worker`: тот же build, другой start command;
- service `web`: `cd apps/web && npm run build && npm run start`;
- managed PostgreSQL;
- migrations job перед deploy API;
- separate env:
  - development;
  - preview;
  - production;
- healthcheck на `/health/ready`;
- rollback plan;
- backup schedule.

Пример scripts после перехода на workspaces:

```json
{
  "scripts": {
    "build": "npm run build -ws",
    "typecheck": "npm run typecheck -ws",
    "test": "npm run test -ws",
    "db:deploy": "prisma migrate deploy",
    "start:api": "node apps/api/dist/main.js",
    "start:worker": "node apps/api/dist/worker.js"
  }
}
```

## 14. Фазы внедрения

### Фаза 0. Зафиксировать baseline

Цель: не менять поведение, но сделать текущее состояние проверяемым.

Работы:

- добавить документированные API-контракты текущих endpoint;
- добавить request id и readiness healthcheck;
- добавить CORS whitelist через env;
- добавить тесты на `BookingService.createBooking`;
- добавить integration test для основных HTTP endpoint;
- зафиксировать Railway env и deploy commands в docs.

Риск: низкий. Это почти не меняет продукт, но сразу снижает риск сломать MVP.

### Фаза 1. Разделить backend на модули без смены схемы БД

Цель: убрать "все в одном файле".

Работы:

- разнести `src/http/server.ts` на route-файлы по модулям;
- разрезать `src/bot/index.ts` на handlers/scenes/actions;
- разрезать `src/services/analytics.ts` на ingestion, attribution, summary;
- ввести `src/modules/*`;
- добавить `packages/contracts` или хотя бы `src/contracts`;
- не менять таблицы, только кодовую организацию и тесты.

Риск: средний. Можно сломать bot-flow из-за большого `src/bot/index.ts`, поэтому нужны bot-flow тесты до рефакторинга.

### Фаза 2. Booking lifecycle и hold expiration

Цель: сделать бронирование надежным.

Работы:

- добавить `holdExpiresAt` и `BookingStatusHistory`;
- использовать `BOOKING_HOLD_MINUTES`;
- добавить job `booking.expire_holds`;
- освобождать seats при cancel/expire;
- добавить idempotency key для создания брони;
- формализовать state machine.

Риск: высокий. Ошибки здесь напрямую влияют на деньги, места и доверие клиентов.

### Фаза 3. Users, roles, owner admin

Цель: заменить single-manager модель на нормальную систему доступа.

Работы:

- добавить `User`, `Membership`, `Role`, `AuditLog`;
- ввести owner admin login;
- закрыть analytics admin нормальной auth session;
- перенести `/stats` на RBAC;
- добавить owner pages: bookings, slots, catalog, analytics.

Риск: средний. Главный риск - случайно дать лишний доступ или потерять доступ текущему менеджеру.

### Фаза 4. Provider/catalog/content

Цель: превратить проект из записи к одному оператору в агрегатор.

Работы:

- добавить `Provider`;
- привязать каталог и слоты к provider;
- сделать provider admin;
- добавить content/media модель;
- перевести landing routes/FAQ/SEO на published content;
- добавить moderation/audit.

Риск: высокий. Меняется модель бизнеса: кто владеет инвентарем, кто подтверждает бронь, кто отвечает за качество.

### Фаза 5. Payments production

Цель: сделать оплату надежной, проверяемой и расширяемой.

Работы:

- добавить `PaymentIntent`, `PaymentAttempt`, `PaymentEvent`, `Refund`;
- проверять Telegram pre-checkout;
- сделать payment handling идемпотентным;
- добавить manual payment и payment link;
- добавить reconciliation и refund flow;
- добавить provider payout/commission основу.

Риск: высокий. Нужно тестировать суммы, валюты, повторные события, отмены и частичные сбои.

### Фаза 6. Analytics/observability/operations

Цель: сделать продукт управляемым.

Работы:

- добавить daily rollups;
- добавить retention policy;
- добавить метрики, tracing, error tracking;
- добавить queue dashboards или хотя бы job logs;
- добавить alerts;
- добавить backup/restore runbook;
- добавить migration CI.

Риск: средний. Основной риск - накопить сырые события без понятной политики хранения и получить тяжелые отчеты.

## 15. Основные риски

### Риск 1. Перепродажа слотов

Причина: места резервируются через `seatsBooked`, но нет полного lifecycle освобождения.

Что сделать:

- state machine;
- hold expiration job;
- integration tests на конкуренцию;
- idempotency key.

### Риск 2. Деньги прошли, бронь не подтвердилась

Причина: payment update и booking update связаны напрямую, но нет durable payment events/outbox.

Что сделать:

- сохранять каждое payment event;
- подтверждать booking идемпотентно;
- alert на payment succeeded без confirmed booking;
- reconciliation job.

### Риск 3. Случайный публичный доступ к админским данным

Причина: analytics admin защищена optional token; CORS открыт для всех origin.

Что сделать:

- admin auth;
- RBAC;
- CORS whitelist;
- noindex оставить, но не считать защитой;
- не хранить admin token в localStorage в долгосрочной версии.

### Риск 4. Provider-модель будет добавлена слишком поздно

Причина: текущие сущности не знают владельца инвентаря.

Что сделать:

- добавить `Provider` рано;
- backfill default provider;
- все новые catalog/booking записи создавать с providerId;
- сразу писать audit log.

### Риск 5. Аналитика станет дорогой и неточной

Причина: отчет сейчас читает события за период и агрегирует в приложении.

Что сделать:

- dedupe key;
- schemaVersion;
- rollup tables;
- явные business events;
- privacy retention.

### Риск 6. Большой Telegram bot file станет точкой отказа разработки

Причина: `src/bot/index.ts` содержит весь сценарий, форматирование, аналитику, оплату и manager logic.

Что сделать:

- выделить scenes/actions;
- покрыть happy path тестами;
- оставить grammY, но перенести доменную логику в application services.

### Риск 7. Deploy не воспроизводится

Причина: Railway deployment описан в README/env, но не в manifest.

Что сделать:

- добавить deploy docs и/или manifest;
- разделить api/web/worker services;
- migrations job;
- readiness healthcheck;
- rollback checklist.

## 16. Рекомендуемый ближайший порядок

Самый практичный путь:

1. Не начинать с большого переноса папок в `apps/api`.
2. Сначала покрыть booking/API/analytics тестами.
3. Затем разнести текущий backend на `src/modules/*` без изменения БД.
4. После этого делать DB migrations для `Provider`, `User`, `Membership`, `BookingStatusHistory`.
5. Потом внедрять hold expiration и worker.
6. Только после надежного booking lifecycle расширять платежи и provider admin.

Так v2 получится не "переписыванием ради архитектуры", а постепенным усилением тех мест, где продукт реально рискует: бронирование, деньги, права доступа, операционная поддержка и аналитика.
