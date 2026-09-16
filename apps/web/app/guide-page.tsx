import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import {
  type GuidePage,
  getGuidePageBySlug,
  siteCopy
} from "../content/landing";
import {
  RouteCard,
  SiteFooter,
  SiteHeader,
  TelegramLink
} from "./site-components";

export function guideMetadata(slug: GuidePage["slug"]): Metadata {
  const page = getGuidePageBySlug(slug);

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
          url: siteCopy.hero.image,
          width: 1400,
          height: 790,
          alt: siteCopy.hero.imageAlt
        }
      ]
    }
  };
}

function guideBotUrl(slug: GuidePage["slug"]) {
  switch (slug) {
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

export function GuidePageView({ slug }: { slug: GuidePage["slug"] }) {
  const page = getGuidePageBySlug(slug);

  if (!page) {
    return null;
  }

  const botUrl = guideBotUrl(page.slug);

  return (
    <main className="sitePage">
      <SiteHeader />

      <section className="guideHero" aria-labelledby="guide-title">
        <div className="container guideHeroInner">
          <div>
            <p className="siteEyebrow">HorseSharing</p>
            <h1 id="guide-title">{page.h1}</h1>
            <p>{page.lead}</p>
            <TelegramLink
              href={botUrl}
              source={page.source}
              target={`${page.slug}_hero_telegram`}
            >
              Написать в Telegram
              <ArrowRight size={18} />
            </TelegramLink>
          </div>
          <img src={siteCopy.hero.image} alt={siteCopy.hero.imageAlt} />
        </div>
      </section>

      <section className="siteSection guideBodySection" aria-labelledby="guide-routes-title">
        <div className="container guideLayout">
          <div className="guideMain">
            <h2 id="guide-routes-title">Маршруты</h2>
            <div className="guideRouteList">
              {siteCopy.routes.map((route) => (
                <RouteCard route={route} source={page.source} key={route.slug} />
              ))}
            </div>
          </div>
          <aside className="guideAside">
            {page.sections.map((section) => (
              <section key={section.title}>
                <h2>{section.title}</h2>
                <p>{section.text}</p>
              </section>
            ))}
          </aside>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
