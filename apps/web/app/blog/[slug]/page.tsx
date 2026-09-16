import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";
import { blogPosts, getBlogPost } from "../../../content/blog";
import { jsonLdString, siteCopy } from "../../../content/landing";
import { SiteFooter, SiteHeader, TelegramLink } from "../../site-components";

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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(articleStructuredData) }}
      />
      <main className="sitePage">
        <SiteHeader />

        <article className="articlePage">
          <header className="articleHero">
            <div className="container articleHeroInner">
              <div>
                <a className="backLink" href="/blog">
                  <ArrowLeft size={17} />
                  Блог
                </a>
                <p className="siteEyebrow">{post.category}</p>
                <h1>{post.h1}</h1>
                <p>{post.description}</p>
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
            </div>

            <aside className="articleAside">
              <strong>Выбрать прогулку</strong>
              <p>Откройте маршруты или сразу напишите в Telegram.</p>
              <a className="secondaryAction fullWidth" href="/routes">
                Маршруты
                <ArrowRight size={18} />
              </a>
              <TelegramLink
                className="primaryAction fullWidth"
                href={siteCopy.botUrls.blog}
                source={post.ctaSource}
                target="article_telegram"
              >
                Telegram
                <ArrowRight size={18} />
              </TelegramLink>
            </aside>
          </div>
        </article>

        <SiteFooter />
      </main>
    </>
  );
}
