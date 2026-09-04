# HorseSharing SEO Plan

Дата: 2026-09-03

## Цель

Получать органический спрос по локальным коммерческим запросам:

- `конные прогулки бишкек`
- `прогулка на лошадях бишкек`
- `покататься на лошадях бишкек`
- `horse riding bishkek`
- `riding bishkek`
- `лошади бишкек инстаграм`

Нельзя обещать первое место. Реалистичная цель v1 - быстро закрыть низкоконкурентные локальные запросы и собрать поведенческий сигнал через понятный переход в Telegram.

## Что убрали из прод-текста

- Упоминания `MVP` и `демо-слоты`.
- Внутренние формулировки вроде `что важно показать перед оплатой`.
- Roadmap-текст про будущий Mini App.
- Обещания безопасности, рейтингов, отзывов и мгновенной оплаты без подтверждения.

## Что добавили в текст

- Основной H1: `Конные прогулки в Бишкеке`.
- Exact-match фразу: `прогулка на лошадях рядом с Бишкеком`.
- Английские запросы в title/meta/visible copy: `horse riding Bishkek`, `riding Bishkek`.
- Локации в видимых заголовках и alt-текстах: `Чункурчак`, `Аламедин`.
- Коммерческие факты: цена от, длительность, группа, Telegram-запись.
- Instagram/2GIS упомянуты как каналы проверки фото и организатора, без фейковых рейтингов.

## Следующие шаги

1. Привязать нормальный домен и обновить `NEXT_PUBLIC_SITE_URL` в Railway service `web`.
2. Подключить Google Search Console и отправить `sitemap.xml`.
3. Добавить 2-3 отдельные посадочные:
   - `/routes/chunkurchak-horse-riding`
   - `/routes/alamedin-horse-riding`
   - `/prices`
4. Добавить реальные страницы организаторов: Instagram, 2GIS, телефон, фото, условия отмены.
5. После первых броней добавить подтвержденные отзывы без накрутки и без schema markup, если источник не проверен.

## Tracking

Deep links в Telegram:

- `https://t.me/horsekgbot?start=seo_home` - главный CTA в hero.
- `https://t.me/horsekgbot?start=seo_booking` - быстрый выбор времени.
- `https://t.me/horsekgbot?start=seo_routes` - CTA в карточках маршрутов.
- `https://t.me/horsekgbot?start=seo_proof` - CTA в блоке фото/доверия.

События:

- `PAGE_VIEW`: загрузка лендинга, источник по `utm_source` или `seo_home`.
- `TELEGRAM_CLICK`: клик по CTA в Telegram.
- `BOT_START`: пользователь открыл бота через `/start <source>`.
- `BOOKING_CREATED`: пользователь дошел до созданной брони.

MVP-отчет: `GET /api/analytics/summary?from=YYYY-MM-DD&to=YYYY-MM-DD`.
Если задан `ANALYTICS_ADMIN_TOKEN`, передавать `Authorization: Bearer <token>`.

Для оценки SEO нужны:

- Google Search Console: показы, клики, CTR, позиции по запросам.
- Яндекс Вебмастер: если целимся в русскоязычный поиск.
- Wordstat/Serpstat/Ahrefs: оценка спроса и конкурентов до запуска.
- Собственная воронка выше: конверсия визит -> Telegram click -> bot start -> бронь.
