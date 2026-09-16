import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPin,
  MessageCircle,
  UsersRound
} from "lucide-react";
import { type LandingRoute, siteCopy } from "../content/landing";

type TelegramLinkProps = {
  children: React.ReactNode;
  href?: string;
  source: string;
  target: string;
  className?: string;
};

export function TelegramLink({
  children,
  href = siteCopy.botUrls.home,
  source,
  target,
  className = "primaryAction"
}: TelegramLinkProps) {
  return (
    <a
      className={className}
      href={href}
      data-analytics-source={source}
      data-analytics-target={target}
    >
      {children}
    </a>
  );
}

export function SiteHeader() {
  return (
    <header className="siteHeader">
      <a className="siteBrand" href="/" aria-label={siteCopy.brandAriaLabel}>
        {siteCopy.brand}
      </a>
      <nav className="siteNav" aria-label={siteCopy.navigationLabel}>
        {siteCopy.nav.map((item) => (
          <a href={item.href} key={item.href}>
            {item.label}
          </a>
        ))}
        <span aria-label="Язык страницы">RU / EN</span>
      </nav>
      <TelegramLink
        className="telegramHeaderLink"
        href={siteCopy.botUrls.home}
        source="header"
        target="header_telegram"
      >
        <MessageCircle size={17} />
        Telegram
      </TelegramLink>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="siteFooter">
      <div className="container footerInner">
        <div>
          <strong>{siteCopy.brand}</strong>
          <p>{siteCopy.footer.text}</p>
        </div>
        <nav aria-label="Нижняя навигация">
          {siteCopy.footer.links.map((link) => (
            <a href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <TelegramLink
          className="footerTelegram"
          href={siteCopy.botUrls.home}
          source="footer"
          target="footer_telegram"
        >
          {siteCopy.telegramHandle}
          <ArrowRight size={17} />
        </TelegramLink>
      </div>
    </footer>
  );
}

export function RouteCard({
  route,
  source = "routes"
}: {
  route: LandingRoute;
  source?: string;
}) {
  return (
    <article className="placeCard">
      <a className="placeCardImage" href={`/routes/${route.slug}`}>
        <img src={route.image} alt={route.alt} />
      </a>
      <div className="placeCardBody">
        <p className="placeLocation">{route.locationLine}</p>
        <h3>
          <a href={`/routes/${route.slug}`}>{route.title}</a>
        </h3>
        <p>{route.summary}</p>
        <div className="placeMeta" aria-label="Коротко о маршруте">
          <span>
            <Clock3 size={15} />
            {route.duration}
          </span>
          <span>
            <UsersRound size={15} />
            {route.groupSize}
          </span>
        </div>
        <div className="placeCardBottom">
          <strong>{route.price}</strong>
          <a
            className="inlineLink"
            href={`/routes/${route.slug}`}
            data-analytics-source={source}
            data-analytics-target={`${route.analyticsTarget}_details`}
          >
            Подробнее
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </article>
  );
}

export function RouteFactList({ route }: { route: LandingRoute }) {
  return (
    <ul className="routeFacts" aria-label="Коротко о маршруте">
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
  );
}

export function CheckList({ items }: { items: readonly string[] }) {
  return (
    <ul className="checkList">
      {items.map((item) => (
        <li key={item}>
          <CheckCircle2 size={18} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
