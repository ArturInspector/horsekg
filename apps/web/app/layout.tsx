import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://horsekg.kg";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Конные прогулки в Бишкеке | HorseSharing",
  description:
    "Выберите локацию, маршрут и свободное время для конной прогулки рядом с Бишкеком. Бронь подтверждает менеджер в Telegram.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Конные прогулки в Бишкеке",
    description:
      "Маршруты в Чункурчаке и Аламедине, цены от 1 500 сом, бронирование через Telegram.",
    url: "/",
    siteName: "HorseSharing Бишкек",
    images: [
      {
        url: "/assets/landing/source-pending/karabulak-tour-horse-2.jpg",
        width: 1080,
        height: 808,
        alt: "Конная прогулка в горах рядом с Бишкеком"
      }
    ],
    locale: "ru_KG",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Конные прогулки в Бишкеке",
    description:
      "Выберите локацию, маршрут и время. Бронь подтверждает менеджер в Telegram.",
    images: ["/assets/landing/source-pending/karabulak-tour-horse-2.jpg"]
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
