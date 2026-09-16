import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import {
  getRelatedRoutes,
  getRouteBySlug,
  jsonLdString,
  siteCopy,
  type LandingRoute
} from "../../../content/landing";
import {
  CheckList,
  RouteCard,
  RouteFactList,
  SiteFooter,
  SiteHeader,
  TelegramLink
} from "../../site-components";

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
    description: `${route.description} ${route.price}, ${route.duration}.`,
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
    touristType: ["Новички", "Пары", "Компании", "Туристы"],
    areaServed: {
      "@type": "Place",
      name: route.area
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "KGS",
      price: String(route.priceValue)
    }
  };
}

function DetailBlock({
  title,
  items
}: {
  title: string;
  items: readonly string[];
}) {
  return (
    <section className="detailBlock">
      <h2>{title}</h2>
      <CheckList items={items} />
    </section>
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(routeStructuredData(route)) }}
      />
      <main className="sitePage">
        <SiteHeader />

        <section className="detailHero" aria-labelledby="route-title">
          <div className="container detailHeroInner">
            <a className="backLink" href="/routes">
              <ArrowLeft size={17} />
              Все маршруты
            </a>
            <p className="siteEyebrow">{route.locationLine}</p>
            <h1 id="route-title">{route.title}</h1>
            <p>{route.description}</p>
            <RouteFactList route={route} />
          </div>
        </section>

        <section className="container detailGallery" aria-label="Фотографии маршрута">
          {route.gallery.map((image, index) => (
            <img
              className={index === 0 ? "detailGalleryMain" : undefined}
              src={image}
              alt={index === 0 ? route.alt : `${route.shortTitle}, фото ${index + 1}`}
              key={image}
            />
          ))}
        </section>

        <section className="container detailLayout">
          <div className="detailMain">
            <section className="detailTextBlock">
              <h2>Что это за прогулка</h2>
              <p>{route.detail}</p>
            </section>

            <div className="detailColumns">
              <DetailBlock title="Что входит" items={route.included} />
              <DetailBlock title="Кому подходит" items={route.goodFor} />
              <DetailBlock title="Как проходит" items={route.plan} />
              <DetailBlock title="Что знать" items={route.needToKnow} />
            </div>
          </div>

          <aside className="detailAside" aria-label="Запись на маршрут">
            <span>Цена</span>
            <strong>{route.price}</strong>
            <p>{route.duration} • {route.travelTime}</p>
            <TelegramLink
              className="primaryAction fullWidth"
              href={siteCopy.botUrls.routes}
              source="route_detail"
              target={`${route.analyticsTarget}_telegram`}
            >
              Написать в Telegram
              <ArrowRight size={18} />
            </TelegramLink>
            <a className="mapLink" href={route.mapUrl}>
              <MapPin size={17} />
              Посмотреть направление
            </a>
          </aside>
        </section>

        {relatedRoutes.length > 0 ? (
          <section className="siteSection relatedSection" aria-labelledby="related-title">
            <div className="container sectionIntro">
              <h2 id="related-title">Похожие прогулки</h2>
            </div>
            <div className="container placeGrid twoColumns">
              {relatedRoutes.map((relatedRoute) => (
                <RouteCard
                  route={relatedRoute}
                  source="route_related"
                  key={relatedRoute.slug}
                />
              ))}
            </div>
          </section>
        ) : null}

        <SiteFooter />
      </main>
    </>
  );
}
