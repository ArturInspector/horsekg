import type { MetadataRoute } from "next";
import { blogPosts } from "../content/blog";
import { commercialPages, siteCopy } from "../content/landing";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ride.kg";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${siteUrl}/blog`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8
    },
    ...commercialPages.map((page) => ({
      url: `${siteUrl}${page.path}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: page.slug === "routes" ? 0.95 : 0.85
    })),
    ...siteCopy.routes.map((route) => ({
      url: `${siteUrl}/routes/${route.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9
    })),
    ...blogPosts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7
    }))
  ];
}
