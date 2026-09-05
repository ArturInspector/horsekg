"use client";

import { useEffect } from "react";
import {
  analyticsAttributionKey,
  analyticsClickEndpoint,
  analyticsEndpoint,
  analyticsSessionKey,
  type AnalyticsEvent,
  type MarketingAttribution
} from "../lib/analytics";

type CreateClickResponse = {
  clickId: string;
};

function createSessionId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

function getSessionId() {
  const existing = window.localStorage.getItem(analyticsSessionKey);

  if (existing) {
    return existing;
  }

  const sessionId = createSessionId();
  window.localStorage.setItem(analyticsSessionKey, sessionId);
  return sessionId;
}

function getParam(params: URLSearchParams, ...names: string[]) {
  for (const name of names) {
    const value = params.get(name);

    if (value) {
      return value;
    }
  }

  return undefined;
}

function attributionFromUrl(): MarketingAttribution {
  const params = new URLSearchParams(window.location.search);

  return {
    utmSource: getParam(params, "utm_source"),
    utmMedium: getParam(params, "utm_medium"),
    utmCampaign: getParam(params, "utm_campaign", "campaign"),
    utmContent: getParam(params, "utm_content", "content"),
    utmTerm: getParam(params, "utm_term", "term"),
    campaignId: getParam(params, "campaign_id", "utm_id"),
    adSetId: getParam(params, "adset_id", "ad_set_id"),
    adId: getParam(params, "ad_id", "adid"),
    fbclid: getParam(params, "fbclid"),
    gclid: getParam(params, "gclid"),
    yclid: getParam(params, "yclid")
  };
}

function hasAttribution(attribution: MarketingAttribution) {
  return Object.values(attribution).some(Boolean);
}

function storedAttribution() {
  const raw = window.sessionStorage.getItem(analyticsAttributionKey);

  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw) as MarketingAttribution;
  } catch {
    return {};
  }
}

function getAttribution(fallbackSource?: string) {
  const fromUrl = attributionFromUrl();
  const stored = storedAttribution();
  const attribution = {
    ...stored,
    ...fromUrl
  };

  if (hasAttribution(fromUrl)) {
    window.sessionStorage.setItem(analyticsAttributionKey, JSON.stringify(attribution));
  }

  return {
    ...attribution,
    source: attribution.utmSource ?? fallbackSource ?? attribution.source ?? "seo_home"
  };
}

function sendEvent(event: AnalyticsEvent) {
  fetch(analyticsEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(event),
    keepalive: true
  }).catch(() => undefined);
}

async function createTelegramClick(event: Omit<AnalyticsEvent, "type">) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 1500);

  try {
    const response = await fetch(analyticsClickEndpoint(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(event),
      signal: controller.signal
    });

    if (!response.ok) {
      return undefined;
    }

    return (await response.json()) as CreateClickResponse;
  } catch {
    return undefined;
  } finally {
    window.clearTimeout(timeout);
  }
}

function withTelegramStart(href: string, start: string) {
  const url = new URL(href);
  url.searchParams.set("start", start);
  return url.toString();
}

export function AnalyticsTracker() {
  useEffect(() => {
    const sessionId = getSessionId();
    const pagePath = `${window.location.pathname}${window.location.search}`;
    const pageAttribution = getAttribution("seo_home");

    sendEvent({
      type: "PAGE_VIEW",
      ...pageAttribution,
      pagePath,
      sessionId,
      referrer: document.referrer || undefined
    });

    const handleClick = async (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const link = target.closest<HTMLAnchorElement>("a[data-analytics-target]");

      if (!link) {
        return;
      }

      event.preventDefault();

      const fallbackHref = link.href;
      const click = await createTelegramClick({
        ...getAttribution(link.dataset.analyticsSource),
        pagePath,
        target: link.dataset.analyticsTarget,
        sessionId,
        referrer: document.referrer || undefined,
        metadata: {
          href: fallbackHref,
          text: link.textContent?.trim()
        }
      });

      window.location.href = click?.clickId
        ? withTelegramStart(fallbackHref, click.clickId)
        : fallbackHref;
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
