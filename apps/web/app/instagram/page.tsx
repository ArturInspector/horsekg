import { CommercialPageView, commercialMetadata } from "../commercial-page";

export const metadata = commercialMetadata("instagram");

export default function InstagramPage() {
  return <CommercialPageView slug="instagram" />;
}
