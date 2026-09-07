import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Info,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Star,
  UsersRound
} from "lucide-react";
import { featuredBlogPosts } from "../content/blog";
import { jsonLdString, siteCopy, structuredData } from "../content/landing";

const conditionIcons = [ShieldCheck, UsersRound, MessageCircle, Info];

export default function Home() {
  const [mainImage, ...secondaryImages] = siteCopy.hero.gallery;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(structuredData) }}
      />
      <main className="marketingPage">
        <header className="v2Header">
          <a className="v2Brand" href="/" aria-label={siteCopy.brandAriaLabel}>
            {siteCopy.brand}
          </a>
          <nav className="v2Nav" aria-label={siteCopy.navigationLabel}>
            {siteCopy.nav.map((item) => (
              <a href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <a
            className="iconButton"
            href={siteCopy.botUrls.home}
            data-analytics-source={siteCopy.hero.primarySource}
            data-analytics-target="header_cta"
            aria-label={siteCopy.hero.primaryCta}
          >
            <MessageCircle size={19} />
          </a>
        </header>

        <section className="v2Hero" aria-labelledby="hero-title">
          <div className="container v2HeroGrid">
            <div className="v2HeroCopy">
              <p className="v2Eyebrow">{siteCopy.hero.eyebrow}</p>
              <h1 id="hero-title">{siteCopy.hero.title}</h1>
              <p className="v2Lead">{siteCopy.hero.text}</p>
              <div className="v2HeroActions">
                <a
                  className="v2Button primary"
                  href={siteCopy.botUrls.home}
                  data-analytics-source={siteCopy.hero.primarySource}
                  data-analytics-target="hero_primary"
                >
                  {siteCopy.hero.primaryCta}
                  <ArrowRight size={18} />
                </a>
                <a className="v2Button quiet" href="#routes">
                  {siteCopy.hero.secondaryCta}
                </a>
              </div>
            </div>

            <div className="v2Gallery" aria-label="Фото конных прогулок">
              <img className="v2GalleryMain" src={mainImage.src} alt={mainImage.alt} />
              <div className="v2GallerySide">
                {secondaryImages.map((image) => (
                  <img src={image.src} alt={image.alt} key={image.src} />
                ))}
              </div>
            </div>

            <aside className="bookingPanel" aria-label={siteCopy.bookingPanel.title}>
              <div className="bookingPanelTop">
                <p>{siteCopy.bookingPanel.title}</p>
                <strong>{siteCopy.bookingPanel.price}</strong>
              </div>
              <div className="bookingFields">
                {siteCopy.bookingPanel.fields.map((field) => (
                  <div className="bookingField" key={field.label}>
                    <span>{field.label}</span>
                    <strong>{field.value}</strong>
                    <div className="choiceRow" aria-label={field.label}>
                      {field.options.map((option) => (
                        <span key={option}>{option}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <a
                className="v2Button dark full"
                href={siteCopy.botUrls.booking}
                data-analytics-source={siteCopy.bookingPanel.source}
                data-analytics-target="quick_booking"
              >
                {siteCopy.bookingPanel.cta}
                <CalendarDays size={18} />
              </a>
              <p className="bookingNote">{siteCopy.bookingPanel.note}</p>
            </aside>
          </div>

          <dl className="container factRail" aria-label={siteCopy.hero.factsLabel}>
            {siteCopy.hero.facts.map((item) => (
              <div key={item.value}>
                <dt>{item.value}</dt>
                <dd>{item.label}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="v2Section" id="routes" aria-labelledby="routes-title">
          <div className="container v2SectionHeader">
            <div>
              <p className="v2Eyebrow">{siteCopy.routesSection.eyebrow}</p>
              <h2 id="routes-title">{siteCopy.routesSection.title}</h2>
            </div>
            <p>{siteCopy.routesSection.text}</p>
          </div>

          <div className="container routeShelf">
            {siteCopy.routes.map((route) => (
              <article className="routeTile" key={route.slug}>
                <a className="routeImageLink" href={`/routes/${route.slug}`}>
                  <img src={route.image} alt={route.alt} />
                </a>
                <div className="routeTileBody">
                  <div className="routeMetaLine">
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
                  <ul className="miniFacts">
                    <li>{route.price}</li>
                    <li>{route.groupSize}</li>
                    <li>{route.level}</li>
                  </ul>
                  <div className="routeActions">
                    <a
                      className="v2Button small primary"
                      href={siteCopy.botUrls.routes}
                      data-analytics-source={siteCopy.routesSection.source}
                      data-analytics-target={route.analyticsTarget}
                    >
                      {siteCopy.routesSection.choosePrefix}
                    </a>
                    <a className="textLink" href={`/routes/${route.slug}`}>
                      {siteCopy.routesSection.detailsPrefix}
                      <ArrowRight size={16} />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="v2Section mutedBand" id="how" aria-labelledby="how-title">
          <div className="container processGrid">
            <div>
              <p className="v2Eyebrow">{siteCopy.howItWorks.eyebrow}</p>
              <h2 id="how-title">{siteCopy.howItWorks.title}</h2>
            </div>
            <div className="processSteps">
              {siteCopy.howItWorks.steps.map((step, index) => (
                <article key={step.title}>
                  <span>{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="v2Section" id="safety" aria-labelledby="conditions-title">
          <div className="container conditionsGrid">
            <div>
              <p className="v2Eyebrow">{siteCopy.conditions.eyebrow}</p>
              <h2 id="conditions-title">{siteCopy.conditions.title}</h2>
              <p className="v2BodyText">{siteCopy.conditions.text}</p>
              <div className="conditionList">
                {siteCopy.conditions.items.map((item, index) => {
                  const Icon = conditionIcons[index] ?? CheckCircle2;

                  return (
                    <article key={item.title}>
                      <Icon size={20} />
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.text}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
            <img src={siteCopy.conditions.image} alt={siteCopy.conditions.imageAlt} />
          </div>
        </section>

        <section className="v2Section mapBand" aria-labelledby="locations-title">
          <div className="container mapGrid">
            <img src={siteCopy.locations.image} alt={siteCopy.locations.imageAlt} />
            <div>
              <p className="v2Eyebrow">{siteCopy.locations.eyebrow}</p>
              <h2 id="locations-title">{siteCopy.locations.title}</h2>
              <p className="v2BodyText">{siteCopy.locations.text}</p>
              <div className="locationLinks">
                {siteCopy.locations.links.map((link) => (
                  <a href={link.href} key={link.href}>
                    {link.label}
                    <ArrowRight size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="v2Proof" aria-labelledby="proof-title">
          <div className="container proofLine">
            <Star size={22} />
            <div>
              <h2 id="proof-title">{siteCopy.proof.title}</h2>
              <p>{siteCopy.proof.text}</p>
            </div>
            <a
              className="v2Button primary"
              href={siteCopy.botUrls.proof}
              data-analytics-source={siteCopy.proof.source}
              data-analytics-target="proof_cta"
            >
              {siteCopy.proof.cta}
            </a>
          </div>
        </section>

        <section className="v2Section" aria-labelledby="blog-title">
          <div className="container v2SectionHeader">
            <div>
              <p className="v2Eyebrow">{siteCopy.blogPreview.eyebrow}</p>
              <h2 id="blog-title">{siteCopy.blogPreview.title}</h2>
            </div>
            <p>{siteCopy.blogPreview.text}</p>
          </div>
          <div className="container blogTeaserGrid">
            {featuredBlogPosts.map((post) => (
              <article className="blogTeaser" key={post.slug}>
                <a href={`/blog/${post.slug}`}>
                  <img src={post.image} alt={post.imageAlt} />
                </a>
                <div>
                  <span>{post.category}</span>
                  <h3>
                    <a href={`/blog/${post.slug}`}>{post.title}</a>
                  </h3>
                  <p>{post.description}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="container centeredAction">
            <a className="v2Button quietBorder" href="/blog">
              {siteCopy.blogPreview.cta}
              <ArrowRight size={18} />
            </a>
          </div>
        </section>

        <section className="v2Section faqV2" id="faq" aria-labelledby="faq-title">
          <div className="container">
            <p className="v2Eyebrow">{siteCopy.faq.eyebrow}</p>
            <h2 id="faq-title">{siteCopy.faq.title}</h2>
            <div className="faqV2Grid">
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
