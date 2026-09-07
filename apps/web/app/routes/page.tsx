import { CommercialPageView, commercialMetadata } from "../commercial-page";

export const metadata = commercialMetadata("routes");

export default function RoutesPage() {
  return <CommercialPageView slug="routes" />;
}
