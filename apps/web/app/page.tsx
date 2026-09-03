import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Star,
  UsersRound
} from "lucide-react";
import { jsonLdString, siteCopy, structuredData } from "../content/landing";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(structuredData) }}
      />
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="heroMedia" aria-hidden="true">
            <img src={siteCopy.hero.image} alt="" />
          </div>
          <div className="heroOverlay" />
          <header className="siteHeader">
            <a className="brand" href="#top" aria-label={siteCopy.brandAriaLabel}>
              {siteCopy.brand}
            </a>
            <nav aria-label={siteCopy.navigationLabel}>
              {siteCopy.nav.map((item) => (
                <a href={item.href} key={item.href}>
                  {item.label}
                </a>
              ))}
            </nav>
          </header>
          <div className="heroContent">
            <p className="eyebrow">{siteCopy.hero.eyebrow}</p>
            <h1 id="hero-title">{siteCopy.hero.title}</h1>
            <p className="heroText">{siteCopy.hero.text}</p>
            <p className="heroSeoText">{siteCopy.hero.seoText}</p>
            <div className="heroActions">
              <a className="button primary" href={siteCopy.botUrl}>
                {siteCopy.hero.primaryCta}
                <ArrowRight size={18} strokeWidth={2.3} />
              </a>
              <a className="button secondary" href="#routes">
                {siteCopy.hero.secondaryCta}
              </a>
            </div>
            <dl className="heroStats" aria-label={siteCopy.hero.statsLabel}>
              {siteCopy.hero.stats.map((item) => (
                <div key={item.value}>
                  <dt>{item.value}</dt>
                  <dd>{item.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="searchBand" id="booking" aria-label={siteCopy.quickPicker.label}>
          <div className="container searchGrid">
            {siteCopy.quickPicker.fields.map((field) => (
              <div key={field.label}>
                <span className="fieldLabel">{field.label}</span>
                <strong>{field.value}</strong>
              </div>
            ))}
            <a className="button dark" href={siteCopy.botUrl}>
              {siteCopy.quickPicker.cta}
              <CalendarDays size={18} />
            </a>
          </div>
        </section>

        <section className="section" id="routes" aria-labelledby="routes-title">
          <div className="container sectionHeader">
            <p className="eyebrow">{siteCopy.routesSection.eyebrow}</p>
            <h2 id="routes-title">{siteCopy.routesSection.title}</h2>
            <p>{siteCopy.routesSection.text}</p>
          </div>
          <div className="container routeGrid">
            {siteCopy.routes.map((route) => (
              <article className="routeCard" key={route.title}>
                <img src={route.image} alt={route.alt} />
                <div className="routeBody">
                  <div className="routeMeta">
                    <span>
                      <MapPin size={15} />
                      {route.area}
                    </span>
                    <span>
                      <Clock3 size={15} />
                      {route.duration}
                    </span>
                  </div>
                  <h3>{route.title}</h3>
                  <p>{route.description}</p>
                  <div className="routeFooter">
                    <div>
                      <strong>{route.price}</strong>
                      <span>{route.level}</span>
                    </div>
                    <a
                      href={siteCopy.botUrl}
                      aria-label={`${siteCopy.routesSection.choosePrefix} ${route.title}`}
                    >
                      {siteCopy.routesSection.choosePrefix}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section split" id="safety" aria-labelledby="safety-title">
          <div className="container splitGrid">
            <div>
              <p className="eyebrow">{siteCopy.safety.eyebrow}</p>
              <h2 id="safety-title">{siteCopy.safety.title}</h2>
              <p>{siteCopy.safety.text}</p>
              <ul className="checkList">
                {siteCopy.safety.items.map((item, index) => {
                  const Icon = [ShieldCheck, UsersRound, MessageCircle][index];

                  return (
                    <li key={item}>
                      <Icon size={20} />
                      {item}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="safetyImage">
              <img src={siteCopy.safety.image} alt={siteCopy.safety.imageAlt} />
            </div>
          </div>
        </section>

        <section className="section locations" aria-labelledby="locations-title">
          <div className="container locationGrid">
            <div>
              <p className="eyebrow">{siteCopy.locations.eyebrow}</p>
              <h2 id="locations-title">{siteCopy.locations.title}</h2>
              <p>{siteCopy.locations.text}</p>
              <div className="locationLinks">
                {siteCopy.locations.links.map((link) => (
                  <a href={link.href} key={link.href}>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            <img src={siteCopy.locations.image} alt={siteCopy.locations.imageAlt} />
          </div>
        </section>

        <section className="section proof" aria-labelledby="proof-title">
          <div className="container proofGrid">
            <div>
              <Star size={21} />
              <h2 id="proof-title">{siteCopy.proof.title}</h2>
            </div>
            <p>{siteCopy.proof.text}</p>
            <a className="button primary compact" href={siteCopy.botUrl}>
              {siteCopy.proof.cta}
              <ArrowRight size={18} />
            </a>
          </div>
        </section>

        <section className="section faq" id="faq" aria-labelledby="faq-title">
          <div className="container">
            <p className="eyebrow">{siteCopy.faq.eyebrow}</p>
            <h2 id="faq-title">{siteCopy.faq.title}</h2>
            <div className="faqGrid">
              {siteCopy.faq.items.map((item) => (
                <article key={item.question}>
                  <CheckCircle2 size={20} />
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
