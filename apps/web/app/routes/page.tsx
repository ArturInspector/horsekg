import type { Metadata } from "next";
import { ArrowRight, MapPin } from "lucide-react";
import { siteCopy } from "../../content/landing";
import {
  RouteCard,
  SiteFooter,
  SiteHeader,
  TelegramLink
} from "../site-components";

export const metadata: Metadata = {
  title: "Маршруты конных прогулок рядом с Бишкеком | HorseSharing",
  description:
    "Чункурчак и Аламедин: сравните конные маршруты по цене, длительности, дороге и уровню.",
  alternates: {
    canonical: "/routes"
  }
};

export default function RoutesPage() {
  return (
    <main className="sitePage">
      <SiteHeader />

      <section className="routesHero" aria-labelledby="routes-title">
        <div className="container routesHeroInner">
          <div>
            <p className="siteEyebrow">Explore</p>
            <h1 id="routes-title">Маршруты рядом с Бишкеком</h1>
            <p>
              Чункурчак для быстрых горных выездов, Аламедин для спокойной
              прогулки по ущелью. Все маршруты можно выбрать без опыта.
            </p>
          </div>
          <div className="exploreStrip" aria-label="Основные направления">
            <span>
              <MapPin size={16} />
              Чункурчак
            </span>
            <span>
              <MapPin size={16} />
              Аламедин
            </span>
            <span>от 1 часа</span>
            <span>от 1 500 сом</span>
          </div>
        </div>
      </section>

      <section className="siteSection routeListSection" aria-label="Список маршрутов">
        <div className="container placeGrid">
          {siteCopy.routes.map((route) => (
            <RouteCard route={route} source="routes_index" key={route.slug} />
          ))}
        </div>
      </section>

      <section className="siteSection routeNoteSection" aria-labelledby="route-note-title">
        <div className="container routeNote">
          <h2 id="route-note-title">Не знаете, что выбрать?</h2>
          <p>
            Для первого раза обычно хватает короткого Чункурчака. Для фото и
            панорамы выбирайте двухчасовой маршрут. Для тихой прогулки смотрите
            Аламедин.
          </p>
          <TelegramLink
            href={siteCopy.botUrls.routes}
            source="routes_index"
            target="routes_help_telegram"
          >
            Спросить в Telegram
            <ArrowRight size={18} />
          </TelegramLink>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
