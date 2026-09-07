import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, CheckCircle2, MessageCircle } from "lucide-react";
import { blogPosts, getBlogPost } from "../../../content/blog";
import { jsonLdString, siteCopy } from "../../../content/landing";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {};
  }

  return {
    title: `${post.title} | HorseSharing`,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `/blog/${post.slug}`
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      images: [
        {
          url: post.image,
          width: 1080,
          height: 808,
          alt: post.imageAlt
        }
      ]
    }
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: `${siteCopy.siteUrl}${post.image}`,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: post.slug === "horse-riding-bishkek-for-tourists" ? "en" : "ru-KG",
    publisher: {
      "@type": "Organization",
      name: siteCopy.brand,
      url: siteCopy.siteUrl
    },
    mainEntityOfPage: `${siteCopy.siteUrl}/blog/${post.slug}`
  };

  return (
    <main className="marketingPage">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(articleStructuredData) }}
      />

      <header className="v2Header">
        <a className="v2Brand" href="/" aria-label={siteCopy.brandAriaLabel}>
          {siteCopy.brand}
        </a>
        <nav className="v2Nav" aria-label="Навигация статьи">
          <a href="/">Главная</a>
          <a href="/blog">Блог</a>
          <a href="/#routes">Маршруты</a>
        </nav>
        <a
          className="iconButton"
          href={siteCopy.botUrls.blog}
          data-analytics-source={post.ctaSource}
          data-analytics-target="article_header_cta"
          aria-label="Записаться в Telegram"
        >
          <MessageCircle size={19} />
        </a>
      </header>

      <article>
        <header className="articleHero">
          <div className="container articleHeroGrid">
            <div>
              <p className="v2Eyebrow">{post.category}</p>
              <h1>{post.h1}</h1>
              <p className="v2Lead">{post.description}</p>
              <div className="articleMeta">
                <span>
                  <CalendarDays size={16} />
                  {new Intl.DateTimeFormat("ru-KG", {
                    dateStyle: "long",
                    timeZone: "Asia/Bishkek"
                  }).format(new Date(post.date))}
                </span>
                <span>{post.readTime}</span>
              </div>
            </div>
            <img src={post.image} alt={post.imageAlt} />
          </div>
        </header>

        <div className="container articleLayout">
          <div className="articleBody">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}

            <section className="articleFaq" aria-labelledby="article-faq-title">
              <h2 id="article-faq-title">Короткие ответы</h2>
              {post.faq.map((item) => (
                <article key={item.question}>
                  <CheckCircle2 size={19} />
                  <div>
                    <h3>{item.question}</h3>
                    <p>{item.answer}</p>
                  </div>
                </article>
              ))}
            </section>
          </div>

          <aside className="articleCta">
            <strong>Хотите записаться?</strong>
            <p>
              Напишите в Telegram. Менеджер проверит время, маршрут и свободных
              лошадей.
            </p>
            <a
              className="v2Button primary full"
              href={siteCopy.botUrls.blog}
              data-analytics-source={post.ctaSource}
              data-analytics-target="article_sidebar_cta"
            >
              Спросить в Telegram
              <ArrowRight size={18} />
            </a>
          </aside>
        </div>
      </article>
    </main>
  );
}
