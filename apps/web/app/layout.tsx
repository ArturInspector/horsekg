import type { Metadata } from "next";
import { siteCopy } from "../content/landing";
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
        url: siteCopy.hero.image,
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
    images: [siteCopy.hero.image]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
