import { jsonLdString, structuredData } from "../content/landing";
import BookingExperience from "./booking-experience";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(structuredData) }}
      />
      <BookingExperience />
    </>
  );
}
