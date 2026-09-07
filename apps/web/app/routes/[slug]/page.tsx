import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CloudSun,
  MapPin,
  MessageCircle,
  Shirt,
  UsersRound
} from "lucide-react";
import {
  getRelatedRoutes,
  getRouteBySlug,
  jsonLdString,
  siteCopy,
  type LandingRoute
} from "../../../content/landing";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return siteCopy.routes.map((route) => ({
    slug: route.slug
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const route = getRouteBySlug(slug);

  if (!route) {
    return {};
  }

  return {
    title: `${route.title} | Конные прогулки Бишкек`,
    description: `${route.description} ${route.price}, ${route.duration}. Запись через Telegram после подтверждения свободных лошадей.`,
    alternates: {
      canonical: `/routes/${route.slug}`
    },
    openGraph: {
      title: route.title,
      description: route.description,
      url: `/routes/${route.slug}`,
      type: "website",
      images: [
        {
          url: route.image,
          width: 1080,
          height: 808,
          alt: route.alt
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: route.title,
      description: route.description,
      images: [route.image]
    }
  };
}

function routeStructuredData(route: LandingRoute) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: route.title,
    description: route.description,
    image: `${siteCopy.siteUrl}${route.image}`,
    url: `${siteCopy.siteUrl}/routes/${route.slug}`,
    touristType: ["Новички", "Компании", "Туристы"],
    areaServed: {
      "@type": "Place",
      name: route.area
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "KGS",
      price: route.price.replace(/\D/g, ""),
      availability: "https://schema.org/InStock"
    }
  };
}

function Header({ route }: { route: LandingRoute }) {
  return (
    <header className="v2Header">
      <a className="v2Brand" href="/" aria-label={siteCopy.brandAriaLabel}>
        {siteCopy.brand}
      </a>
      <nav className="v2Nav" aria-label="Навигация маршрута">
        <a href="/">Главная</a>
        <a href="/routes">Маршруты</a>
        <a href="/prices">Цены</a>
        <a href="/blog">Блог</a>
      </nav>
      <a
        className="headerCta"
        href={siteCopy.botUrls.routes}
        data-analytics-source={siteCopy.routesSection.source}
        data-analytics-target={`${route.analyticsTarget}_header`}
      >
        <MessageCircle size={18} />
        Telegram
      </a>
    </header>
  );
}

function DetailList({
  title,
  items
}: {
  title: string;
  items: readonly string[];
}) {
  return (
    <article className="detailList">
      <h2>{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item}>
            <CheckCircle2 size={18} />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

export default async function RoutePage({ params }: Props) {
  const { slug } = await params;
  const route = getRouteBySlug(slug);

  if (!route) {
    notFound();
  }

  const relatedRoutes = getRelatedRoutes(route);

  return (
    <main className="marketingPage">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(routeStructuredData(route)) }}
      />

      <Header route={route} />

      <section className="routePageHero" aria-labelledby="route-title">
        <div className="container routePageGrid">
          <div>
            <p className="v2Eyebrow">{route.locationLine}</p>
            <h1 id="route-title">{route.title}</h1>
            <p className="v2Lead">{route.description}</p>
            <ul className="routePageFacts" aria-label="Коротко о маршруте">
              <li>
                <Clock3 size={17} />
                {route.duration}
              </li>
              <li>
                <MapPin size={17} />
                {route.area}
              </li>
              <li>
                <UsersRound size={17} />
                {route.groupSize}
              </li>
              <li>
                <CheckCircle2 size={17} />
                {route.level}
              </li>
            </ul>
            <div className="v2HeroActions">
              <a
                className="v2Button primary"
                href={siteCopy.botUrls.routes}
                data-analytics-source={siteCopy.routesSection.source}
                data-analytics-target={`${route.analyticsTarget}_route_page`}
              >
                Проверить время
                <CalendarDays size={18} />
              </a>
              <a className="v2Button quietBorder" href={route.mapUrl}>
                Открыть 2GIS
                <MapPin size={18} />
              </a>
            </div>
          </div>

          <aside className="routeBookingCard">
            <img src={route.image} alt={route.alt} />
            <div>
              <span>Цена</span>
              <strong>{route.price}</strong>
              <p>{route.caution}</p>
              <div className="timeRow">
                <span>Время:</span>
                {route.nearestTimes.map((time) => (
                  <b key={time}>{time}</b>
                ))}
              </div>
              <a
                className="v2Button dark full"
                href={siteCopy.botUrls.routes}
                data-analytics-source={siteCopy.routesSection.source}
                data-analytics-target={`${route.analyticsTarget}_hero_booking_card`}
              >
                Записаться в Telegram
                <ArrowRight size={18} />
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="v2Section tightTop" aria-labelledby="route-details-title">
        <div className="container routeDetailMatrix">
          <DetailList title="Что входит" items={route.included} />
          <DetailList title="Кому подходит" items={route.goodFor} />
          <DetailList title="Расписание и слоты" items={route.schedule} />
          <DetailList title="Что взять с собой" items={route.bring} />
        </div>
      </section>

      <section className="v2Section mutedBand" aria-labelledby="route-flow-title">
        <div className="container routeFlowGrid">
          <div>
            <p className="v2Eyebrow">Как проходит поездка</p>
            <h2 id="route-flow-title">От заявки до старта</h2>
            <p className="v2BodyText">
              Маршрут не продается вслепую: сначала проверяются лошади,
              инструктор, состав группы и погода.
            </p>
          </div>
          <ol className="flowList">
            {route.flow.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className="v2Section" aria-labelledby="route-weather-title">
        <div className="container weatherPanel">
          <CloudSun size={28} />
          <div>
            <h2 id="route-weather-title">Погода и перенос</h2>
            <p>{route.weather}</p>
          </div>
          <a
            className="v2Button primary"
            href={siteCopy.botUrls.routes}
            data-analytics-source={siteCopy.routesSection.source}
            data-analytics-target={`${route.analyticsTarget}_weather_cta`}
          >
            Уточнить условия
          </a>
        </div>
      </section>

      <section className="v2Section routeRelatedSection" aria-labelledby="related-title">
        <div className="container v2SectionHeader">
          <div>
            <p className="v2Eyebrow">Еще маршруты</p>
            <h2 id="related-title">Сравнить перед записью</h2>
          </div>
          <p>
            Если этот вариант не подходит по длительности, цене или уровню,
            откройте соседние маршруты.
          </p>
        </div>
        <div className="container relatedRouteGrid">
          {relatedRoutes.map((relatedRoute) => (
            <a
              className="relatedRoute"
              href={`/routes/${relatedRoute.slug}`}
              key={relatedRoute.slug}
            >
              <img src={relatedRoute.image} alt={relatedRoute.alt} />
              <span>{relatedRoute.locationLine}</span>
              <strong>{relatedRoute.title}</strong>
              <p>
                {relatedRoute.price} • {relatedRoute.duration} • {relatedRoute.level}
              </p>
            </a>
          ))}
        </div>
      </section>

      <section className="v2Section commercialBand" aria-labelledby="route-seo-title">
        <div className="container seoCardGrid">
          <a className="seoCard" href="/prices">
            <Shirt size={20} />
            <span>Цены и что входит</span>
            <p>Понять ориентиры до заявки и что уточняется отдельно.</p>
            <b>
              Открыть
              <ArrowRight size={15} />
            </b>
          </a>
          <a className="seoCard" href="/for-beginners">
            <CheckCircle2 size={20} />
            <span>Для новичков</span>
            <p>Как выбрать первый маршрут и что написать менеджеру.</p>
            <b>
              Открыть
              <ArrowRight size={15} />
            </b>
          </a>
          <a className="seoCard" href="/with-kids">
            <UsersRound size={20} />
            <span>С детьми</span>
            <p>Какие условия нужно подтвердить до поездки.</p>
            <b>
              Открыть
              <ArrowRight size={15} />
            </b>
          </a>
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
            href={siteCopy.botUrls.routes}
            data-analytics-source={siteCopy.routesSection.source}
            data-analytics-target={`${route.analyticsTarget}_footer_cta`}
          >
            {siteCopy.telegramHandle}
          </a>
        </div>
      </footer>
    </main>
  );
}
