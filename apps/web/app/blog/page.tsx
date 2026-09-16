import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { blogPosts } from "../../content/blog";
import { siteCopy } from "../../content/landing";
import { SiteFooter, SiteHeader, TelegramLink } from "../site-components";

export const metadata: Metadata = {
  title: "Гиды по конным прогулкам в Бишкеке | HorseSharing",
  description:
    "Практичные статьи про Чункурчак, Аламедин, первую прогулку на лошади и horse riding near Bishkek.",
  alternates: {
    canonical: "/blog"
  }
};

export default function BlogPage() {
  return (
    <main className="sitePage">
      <SiteHeader />

      <section className="blogHero" aria-labelledby="blog-title">
        <div className="container blogHeroInner">
          <div>
            <p className="siteEyebrow">Блог</p>
            <h1 id="blog-title">Гиды перед прогулкой</h1>
            <p>
              Коротко о маршрутах, первом опыте, одежде, дороге от Бишкека и
              выборе между Чункурчаком и Аламедином.
            </p>
            <TelegramLink
              href={siteCopy.botUrls.blog}
              source="blog"
              target="blog_telegram"
            >
              Спросить про прогулку
              <ArrowRight size={18} />
            </TelegramLink>
          </div>
          <img src={blogPosts[0].image} alt={blogPosts[0].imageAlt} />
        </div>
      </section>

      <section className="siteSection" aria-labelledby="posts-title">
        <div className="container sectionIntro">
          <h2 id="posts-title">Статьи</h2>
        </div>
        <div className="container blogGrid">
          {blogPosts.map((post) => (
            <article className="blogCard" key={post.slug}>
              <a className="blogCardImage" href={`/blog/${post.slug}`}>
                <img src={post.image} alt={post.imageAlt} />
              </a>
              <div>
                <span>{post.category}</span>
                <h3>
                  <a href={`/blog/${post.slug}`}>{post.title}</a>
                </h3>
                <p>{post.description}</p>
                <a className="inlineLink" href={`/blog/${post.slug}`}>
                  Читать
                  <ArrowRight size={16} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
