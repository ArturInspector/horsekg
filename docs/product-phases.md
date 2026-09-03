# HorseSharing Product Phases

## References

- GetYourGuide: catalog cards, durations, cancellation/trust markers, reviews.
- Tripster and local tour marketplaces: guide-led experience positioning.
- 2GIS: local trust surface, phone-first behavior, reviews, map intent.
- Airbnb Experiences: filters by date, people, language/level, host communication.
- Telegram Mini Apps: future richer booking UI inside Telegram without replacing backend.

## Phase 0: Supply

- Collect 10-20 providers around Bishkek.
- Normalize location, route, price, duration, capacity, photos, contacts.
- Decide the operational rule: instant booking only for trusted slots, otherwise pending confirmation.

## Phase 1: Telegram Bot MVP

- Browse locations.
- Browse available horses with photos.
- Choose route, time slot, horse or automatic matching.
- Leave contact phone.
- Create booking in PostgreSQL.
- Notify manager/admin chat.
- Keep payment optional until provider token is configured.

## Phase 2: Payments

- Connect a Telegram payment provider through BotFather.
- Store payment attempts and successful charges.
- Move booking from `PENDING_PAYMENT` to `CONFIRMED` on `successful_payment`.
- Add refund/cancellation policy and manager-side payment reconciliation.

## Phase 3: Web Aggregator

- Use the existing `/api/*` endpoints.
- Add SEO pages for query clusters:
  - `конные прогулки Бишкек`
  - `покататься на лошадях Бишкек`
  - `прокат лошадей Бишкек`
  - `конная прогулка Чункурчак`
  - `конная прогулка Аламедин`
- Add schema.org structured data for local business, offer, FAQ and reviews.

## Phase 4: Operations

- Provider dashboard or admin panel.
- Slot inventory management.
- Booking statuses, cancellation flow, manual overrides.
- UTM/deep-link attribution from Telegram channels.

## Phase 5: Scale

- Telegram Mini App for a richer booking interface.
- Web checkout and payment links.
- Redis-backed queue for notifications and provider sync.
- Provider scoring by confirmation speed, cancellation rate and reviews.
