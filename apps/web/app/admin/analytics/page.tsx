import type { Metadata } from "next";
import { AnalyticsAdmin } from "./analytics-admin";

export const metadata: Metadata = {
  title: "Отчет по заявкам | HorseSharing",
  robots: {
    index: false,
    follow: false
  }
};

export default function AnalyticsAdminPage() {
  return <AnalyticsAdmin />;
}
