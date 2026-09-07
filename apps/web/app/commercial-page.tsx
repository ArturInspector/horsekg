import type { Metadata } from "next";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  MessageCircle,
  UsersRound
} from "lucide-react";
import {
  type CommercialPage,
  commercialPages,
  getCommercialPageBySlug,
  siteCopy
} from "../content/landing";
import {
  createCommercialIntentMetadata,
  createRouteIntentMetadata,
  metadataJson
} from "../lib/booking-intent";

export function commercialMetadata(slug: CommercialPage["slug"]): Metadata {
  const page = getCommercialPageBySlug(slug);

  if (!page) {
    return {};
  }

  return {
    title: `${page.title} | HorseSharing`,
    description: page.description,
    alternates: {
      canonical: page.path
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: page.path,
      type: "website",
      images: [
        {
          url: siteCopy.hero.gallery[0].src,
          width: 1080,
          height: 808,
          alt: siteCopy.hero.gallery[0].alt
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [siteCopy.hero.gallery[0].src]
    }
  };
}

function Header({ source }: { source: string }) {
  return (
    <header className="v2Header">
      <a className="v2Brand" href="/" aria-label={siteCopy.brandAriaLabel}>
        {siteCopy.brand}
      </a>
      <nav className="v2Nav" aria-label="Навигация страницы">
        <a href="/">Главная</a>
        <a href="/routes">Маршруты</a>
        <a href="/prices">Цены</a>
        <a href="/blog">Блог</a>
      </nav>
      <a
        className="headerCta"
        href={siteCopy.botUrls.home}
        data-analytics-source={source}
        data-analytics-target="commercial_header_cta"
      >
        <MessageCircle size={18} />
        Telegram
      </a>
    </header>
  );
}

function commercialBotUrl(slug: CommercialPage["slug"]) {
  switch (slug) {
    case "routes":
      return siteCopy.botUrls.routes;
    case "prices":
      return siteCopy.botUrls.prices;
    case "for-beginners":
      return siteCopy.botUrls.beginners;
    case "with-kids":
      return siteCopy.botUrls.kids;
    case "instagram":
      return siteCopy.botUrls.instagram;
  }
}

function RouteCard({ source }: { source: string }) {
  return (
    <div className="routeShelf commercialRoutes">
      {siteCopy.routes.map((route) => (
        <article className="routeTile" key={route.slug}>
          <a className="routeImageLink" href={`/routes/${route.slug}`}>
            <img src={route.image} alt={route.alt} />
          </a>
          <div className="routeTileBody">
            <p className="routeKicker">{route.locationLine}</p>
            <h3>{route.title}</h3>
            <strong className="routePrice">{route.price}</strong>
            <ul className="miniFacts">
              <li>
                <Clock3 size={14} />
                {route.duration}
              </li>
              <li>
                <UsersRound size={14} />
                {route.groupSize}
              </li>
              <li>
                <CheckCircle2 size={14} />
                {route.level}
              </li>
            </ul>
            <div className="timeRow">
              <span>Ориентир:</span>
              {route.nearestTimes.map((time) => (
                <b key={time}>{time}</b>
              ))}
            </div>
            <a
              className="v2Button small primary"
              href={siteCopy.botUrls.routes}
              data-analytics-source={source}
              data-analytics-target={route.analyticsTarget}
              data-analytics-metadata={metadataJson(
                createRouteIntentMetadata(route, "commercial_route_card")
              )}
            >
              Выбрать
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}

export function CommercialPageView({ slug }: { slug: CommercialPage["slug"] }) {
  const page = getCommercialPageBySlug(slug) ?? commercialPages[0];
  const botUrl = commercialBotUrl(page.slug);

  return (
    <main className="marketingPage">
      <Header source={page.source} />

      <section className="commercialHero" aria-labelledby="commercial-title">
        <div className="container commercialHeroGrid">
          <div>
            <p className="v2Eyebrow">HorseSharing • {siteCopy.domain}</p>
            <h1 id="commercial-title">{page.h1}</h1>
            <p className="v2Lead">{page.lead}</p>
            <div className="v2HeroActions">
              <a
                className="v2Button primary"
                href={botUrl}
                data-analytics-source={page.source}
                data-analytics-target={`${page.slug}_hero_cta`}
                data-analytics-metadata={metadataJson(
                  createCommercialIntentMetadata(page, "commercial_hero")
                )}
              >
                {page.cta}
                <ArrowRight size={18} />
              </a>
              <a className="v2Button quiet" href="/routes">
                Сравнить маршруты
              </a>
            </div>
          </div>
          <aside className="commercialBookingCard">
            <span>Ориентир</span>
            <strong>от 1 500 сом/чел</strong>
            <p>1-2 часа • Чункурчак и Аламедин • подтверждение в Telegram</p>
            <a
              className="v2Button dark full"
              href={botUrl}
              data-analytics-source={page.source}
              data-analytics-target={`${page.slug}_booking_card`}
              data-analytics-metadata={metadataJson(
                createCommercialIntentMetadata(page, "commercial_booking_card")
              )}
            >
              Проверить время
              <CalendarDays size={18} />
            </a>
          </aside>
        </div>
      </section>

      <section className="v2Section tightTop" aria-labelledby="commercial-routes-title">
        <div className="container v2SectionHeader">
          <div>
            <p className="v2Eyebrow">Маршруты</p>
            <h2 id="commercial-routes-title">Что можно выбрать сейчас</h2>
          </div>
          <p>
            Цены и время на карточках - ориентир для быстрого выбора. Итоговые
            условия подтверждаются менеджером после заявки.
          </p>
        </div>
        <div className="container">
          <RouteCard source={page.source} />
        </div>
      </section>

      <section className="v2Section mutedBand" aria-labelledby="commercial-info-title">
        <div className="container commercialInfoGrid">
          {page.blocks.map((block) => (
            <article key={block.title}>
              <CheckCircle2 size={22} />
              <h2>{block.title}</h2>
              <p>{block.text}</p>
            </article>
          ))}
          <article>
            <MapPin size={22} />
            <h2>Куда дальше</h2>
            <p>
              Откройте маршрут, сравните детали или сразу напишите в Telegram.
              Менеджер подскажет ближайшее доступное время.
            </p>
          </article>
        </div>
      </section>

      <section className="v2Section" aria-labelledby="commercial-links-title">
        <div className="container v2SectionHeader">
          <div>
            <p className="v2Eyebrow">Полезные ссылки</p>
            <h2 id="commercial-links-title">Связанные страницы</h2>
          </div>
          <p>
            Эти страницы закрывают соседние поисковые вопросы и ведут к тем же
            маршрутам без раздувания лендинга.
          </p>
        </div>
        <div className="container seoCardGrid">
          {commercialPages
            .filter((item) => item.slug !== page.slug)
            .map((item) => (
              <a className="seoCard" href={item.path} key={item.slug}>
                <span>{item.h1}</span>
                <p>{item.description}</p>
                <b>
                  Открыть
                  <ArrowRight size={15} />
                </b>
              </a>
            ))}
        </div>
      </section>

      <footer className="siteFooter">
        <div className="container footerGrid">
          <div>
            <strong>{siteCopy.domain}</strong>
            <p>{siteCopy.footer.text}</p>
          </div>
          <nav aria-label="Нижняя навигация">
            {siteCopy.footer.links.map((link) => (
              <a href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <a
            className="v2Button primary"
            href={botUrl}
            data-analytics-source={page.source}
            data-analytics-target={`${page.slug}_footer_cta`}
            data-analytics-metadata={metadataJson(
              createCommercialIntentMetadata(page, "commercial_footer")
            )}
          >
            {siteCopy.telegramHandle}
          </a>
        </div>
      </footer>
    </main>
  );
}
