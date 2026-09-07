import type { Metadata } from "next";
import { ArrowRight, MessageCircle } from "lucide-react";
import { blogPosts } from "../../content/blog";
import { siteCopy } from "../../content/landing";

export const metadata: Metadata = {
  title: "Блог о конных прогулках в Бишкеке | HorseSharing",
  description:
    "Гиды по конным прогулкам рядом с Бишкеком: Чункурчак, Аламедин, horse riding, цены, подготовка, дети и запись через Telegram.",
  alternates: {
    canonical: "/blog"
  },
  openGraph: {
    title: "Блог о конных прогулках в Бишкеке",
    description:
      "Практичные статьи для тех, кто ищет лошадей, маршруты и horse riding рядом с Бишкеком.",
    url: "/blog",
    type: "website",
    images: [
      {
        url: blogPosts[0].image,
        width: 1080,
        height: 808,
        alt: blogPosts[0].imageAlt
      }
    ]
  }
};

export default function BlogPage() {
  const [featuredPost, ...posts] = blogPosts;

  return (
    <main className="marketingPage">
      <header className="v2Header">
        <a className="v2Brand" href="/" aria-label={siteCopy.brandAriaLabel}>
          {siteCopy.brand}
        </a>
        <nav className="v2Nav" aria-label="Навигация блога">
          <a href="/">Главная</a>
          <a href="/#routes">Маршруты</a>
          <a href="/blog">Блог</a>
        </nav>
        <a
          className="iconButton"
          href={siteCopy.botUrls.blog}
          data-analytics-source="seo_blog"
          data-analytics-target="blog_header_cta"
          aria-label="Записаться в Telegram"
        >
          <MessageCircle size={19} />
        </a>
      </header>

      <section className="blogHero" aria-labelledby="blog-title">
        <div className="container blogHeroGrid">
          <div>
            <p className="v2Eyebrow">Блог</p>
            <h1 id="blog-title">Блог о конных прогулках в Бишкеке</h1>
            <p className="v2Lead">
              Собираем понятные ответы для тех, кто ищет прогулку на лошадях,
              horse riding near Bishkek, Чункурчак, Аламедин и проверку
              организаторов через Instagram или 2GIS.
            </p>
            <a
              className="v2Button primary"
              href={siteCopy.botUrls.blog}
              data-analytics-source="seo_blog"
              data-analytics-target="blog_hero_cta"
            >
              Спросить про прогулку
              <ArrowRight size={18} />
            </a>
          </div>
          <a className="featuredPost" href={`/blog/${featuredPost.slug}`}>
            <img src={featuredPost.image} alt={featuredPost.imageAlt} />
            <div>
              <span>{featuredPost.category}</span>
              <h2>{featuredPost.title}</h2>
              <p>{featuredPost.description}</p>
            </div>
          </a>
        </div>
      </section>

      <section className="v2Section" aria-labelledby="all-posts-title">
        <div className="container v2SectionHeader">
          <div>
            <p className="v2Eyebrow">Статьи</p>
            <h2 id="all-posts-title">Что люди ищут перед поездкой</h2>
          </div>
          <p>
            Эти материалы написаны под реальные вопросы: первый раз, дети,
            Чункурчак, Аламедин, Instagram, 2GIS и английский запрос horse riding.
          </p>
        </div>
        <div className="container blogIndexGrid">
          {posts.map((post) => (
            <article className="blogIndexCard" key={post.slug}>
              <a href={`/blog/${post.slug}`}>
                <img src={post.image} alt={post.imageAlt} />
              </a>
              <div>
                <span>{post.category}</span>
                <h3>
                  <a href={`/blog/${post.slug}`}>{post.title}</a>
                </h3>
                <p>{post.description}</p>
                <a className="textLink" href={`/blog/${post.slug}`}>
                  Читать
                  <ArrowRight size={16} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
