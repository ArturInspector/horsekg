import { CommercialPageView, commercialMetadata } from "../commercial-page";

export const metadata = commercialMetadata("with-kids");

export default function WithKidsPage() {
  return <CommercialPageView slug="with-kids" />;
}
