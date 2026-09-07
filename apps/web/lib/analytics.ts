const fallbackApiUrl =
  process.env.NODE_ENV === "production"
    ? "https://api-production-a8255.up.railway.app"
    : undefined;

export const analyticsSessionKey = "horsesharing.analytics.session";
export const analyticsAttributionKey = "horsesharing.analytics.attribution";

export type AnalyticsEventType = "PAGE_VIEW" | "TELEGRAM_CLICK";

export type MarketingAttribution = {
  source?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  campaignId?: string;
  adSetId?: string;
  adId?: string;
  fbclid?: string;
  gclid?: string;
  yclid?: string;
};

export type AnalyticsEvent = MarketingAttribution & {
  type: AnalyticsEventType;
  clickId?: string;
  pagePath?: string;
  target?: string;
  sessionId?: string;
  referrer?: string;
  metadata?: Record<string, unknown>;
};

function analyticsUrl(path: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? fallbackApiUrl;

  if (!apiUrl) {
    return undefined;
  }

  return `${apiUrl.replace(/\/$/, "")}${path}`;
}

export function analyticsEndpoint() {
  return analyticsUrl("/api/analytics/events");
}

export function analyticsClickEndpoint() {
  return analyticsUrl("/api/analytics/clicks");
}

export function analyticsSummaryEndpoint() {
  return analyticsUrl("/api/analytics/summary");
}
