import type { Metadata } from "next";
import { siteCopy } from "../content/landing";
import { AnalyticsTracker } from "./analytics-tracker";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteCopy.siteUrl),
  title: siteCopy.metadata.title,
  description: siteCopy.metadata.description,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: siteCopy.metadata.openGraphTitle,
    description: siteCopy.metadata.openGraphDescription,
    url: "/",
    siteName: siteCopy.metadata.siteName,
    images: [
      {
        url: siteCopy.hero.gallery[0].src,
        width: 1080,
        height: 808,
        alt: siteCopy.routes[0].alt
      }
    ],
    locale: "ru_KG",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: siteCopy.metadata.openGraphTitle,
    description: siteCopy.metadata.openGraphDescription,
    images: [siteCopy.hero.gallery[0].src]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
