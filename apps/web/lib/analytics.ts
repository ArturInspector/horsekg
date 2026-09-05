const fallbackApiUrl = "https://api-production-a8255.up.railway.app";

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

export function analyticsEndpoint() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? fallbackApiUrl;
  return `${apiUrl.replace(/\/$/, "")}/api/analytics/events`;
}

export function analyticsClickEndpoint() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? fallbackApiUrl;
  return `${apiUrl.replace(/\/$/, "")}/api/analytics/clicks`;
}

export function analyticsSummaryEndpoint() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? fallbackApiUrl;
  return `${apiUrl.replace(/\/$/, "")}/api/analytics/summary`;
}
