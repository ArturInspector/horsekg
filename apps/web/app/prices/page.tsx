import { CommercialPageView, commercialMetadata } from "../commercial-page";

export const metadata = commercialMetadata("prices");

export default function PricesPage() {
  return <CommercialPageView slug="prices" />;
}
