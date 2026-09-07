import type { CommercialPage, LandingRoute } from "../content/landing";

export type BookingIntentSelection = Record<string, string>;

export type BookingIntentMetadata = {
  intentVersion: "booking_intent_v1";
  bookingIntent: {
    surface: string;
    selectedRouteSlug?: string;
    when?: string;
    location?: string;
    participants?: string;
    duration?: string;
    selectedSlot?: string;
    availabilityStatus?: string;
    confirmationMode?: string;
    capacityMin?: number;
    capacityMax?: number;
    fallbackAlternatives?: readonly string[];
    whenId?: string;
    locationId?: string;
    participantsId?: string;
    durationId?: string;
  };
};

export type RouteIntentMetadata = {
  intentVersion: "route_intent_v1";
  routeIntent: {
    surface: string;
    slug: string;
    title: string;
    location: string;
    duration: string;
    price: string;
    availabilityStatus: string;
    confirmationMode: string;
    capacityMax: number;
    slots: readonly string[];
  };
};

export type CommercialIntentMetadata = {
  intentVersion: "commercial_intent_v1";
  commercialIntent: {
    surface: string;
    page: CommercialPage["slug"];
    path: CommercialPage["path"];
  };
};

function slugify(value: string | undefined) {
  return value
    ?.toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[^a-zа-я0-9]+/gi, "_")
    .replace(/^_+|_+$/g, "");
}

export function createBookingIntentMetadata(
  selection: BookingIntentSelection,
  surface: string,
  availability?: {
    selectedRouteSlug?: string;
    selectedSlot?: string;
    availabilityStatus?: string;
    confirmationMode?: string;
    capacityMin?: number;
    capacityMax?: number;
    fallbackAlternatives?: readonly string[];
  }
): BookingIntentMetadata {
  return {
    intentVersion: "booking_intent_v1",
    bookingIntent: {
      surface,
      selectedRouteSlug: availability?.selectedRouteSlug,
      when: selection["Когда"],
      location: selection["Локация"],
      participants: selection["Участники"],
      duration: selection["Длительность"],
      selectedSlot: availability?.selectedSlot,
      availabilityStatus: availability?.availabilityStatus,
      confirmationMode: availability?.confirmationMode,
      capacityMin: availability?.capacityMin,
      capacityMax: availability?.capacityMax,
      fallbackAlternatives: availability?.fallbackAlternatives,
      whenId: slugify(selection["Когда"]),
      locationId: slugify(selection["Локация"]),
      participantsId: slugify(selection["Участники"]),
      durationId: slugify(selection["Длительность"])
    }
  };
}

export function createRouteIntentMetadata(
  route: LandingRoute,
  surface: string
): RouteIntentMetadata {
  return {
    intentVersion: "route_intent_v1",
    routeIntent: {
      surface,
      slug: route.slug,
      title: route.title,
      location: route.area,
      duration: route.duration,
      price: route.price,
      availabilityStatus: route.availability.status,
      confirmationMode: route.availability.confirmationMode,
      capacityMax: route.availability.capacityMax,
      slots: route.availability.slots.map((slot) => slot.time)
    }
  };
}

export function createCommercialIntentMetadata(
  page: CommercialPage,
  surface: string
): CommercialIntentMetadata {
  return {
    intentVersion: "commercial_intent_v1",
    commercialIntent: {
      surface,
      page: page.slug,
      path: page.path
    }
  };
}

export function metadataJson(
  metadata: BookingIntentMetadata | RouteIntentMetadata | CommercialIntentMetadata
) {
  return JSON.stringify(metadata);
}
