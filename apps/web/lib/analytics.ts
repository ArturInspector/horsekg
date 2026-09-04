const fallbackApiUrl = "https://api-production-a8255.up.railway.app";

export const analyticsSessionKey = "horsesharing.analytics.session";

export type AnalyticsEventType = "PAGE_VIEW" | "TELEGRAM_CLICK";

export type AnalyticsEvent = {
  type: AnalyticsEventType;
  source?: string;
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
