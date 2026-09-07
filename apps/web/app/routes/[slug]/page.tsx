import type { Metadata } from "next";
import { notFound } from "next/navigation";
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

export default async function RoutePage({ params }: Props) {
  const { slug } = await params;
  const route = getRouteBySlug(slug);

  if (!route) {
    notFound();
  }

  return (
    <main className="marketingPage">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(routeStructuredData(route)) }}
      />

      <header className="v2Header">
        <a className="v2Brand" href="/" aria-label={siteCopy.brandAriaLabel}>
          {siteCopy.brand}
        </a>
        <nav className="v2Nav" aria-label="Навигация маршрута">
          <a href="/">Главная</a>
          <a href="/#routes">Маршруты</a>
          <a href="/blog">Блог</a>
        </nav>
        <a
          className="iconButton"
          href={siteCopy.botUrls.routes}
          data-analytics-source={siteCopy.routesSection.source}
          data-analytics-target={`${route.analyticsTarget}_header`}
          aria-label="Записаться в Telegram"
        >
          <MessageCircle size={19} />
        </a>
      </header>

      <section className="routePageHero" aria-labelledby="route-title">
        <div className="container routePageGrid">
          <div>
            <p className="v2Eyebrow">{route.area}</p>
            <h1 id="route-title">{route.title}</h1>
            <p className="v2Lead">{route.description}</p>
            <ul className="routePageFacts" aria-label="Коротко о маршруте">
              <li>
                <Clock3 size={17} />
                {route.duration}
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
          <img src={route.image} alt={route.alt} />
        </div>
      </section>

      <section className="v2Section" aria-labelledby="route-details-title">
        <div className="container routeDetailsGrid">
          <div>
            <p className="v2Eyebrow">Кому подходит</p>
            <h2 id="route-details-title">{route.goodFor}</h2>
            <p className="v2BodyText">{route.caution}</p>
          </div>
          <div className="routeHighlightList">
            {route.highlights.map((highlight) => (
              <article key={highlight}>
                <CheckCircle2 size={20} />
                <span>{highlight}</span>
              </article>
            ))}
          </div>
          <aside className="routePricePanel">
            <span>Цена</span>
            <strong>{route.price}</strong>
            <p>
              Оплата и точное время подтверждаются менеджером. Если слот занят,
              он предложит ближайший вариант.
            </p>
            <a
              className="v2Button dark full"
              href={siteCopy.botUrls.routes}
              data-analytics-source={siteCopy.routesSection.source}
              data-analytics-target={`${route.analyticsTarget}_price_panel`}
            >
              Записаться
              <ArrowRight size={18} />
            </a>
          </aside>
        </div>
      </section>
    </main>
  );
}
