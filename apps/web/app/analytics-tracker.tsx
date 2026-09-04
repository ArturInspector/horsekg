"use client";

import { useEffect } from "react";
import {
  analyticsEndpoint,
  analyticsSessionKey,
  type AnalyticsEvent
} from "../lib/analytics";

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

function sourceFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("utm_source") ?? "seo_home";
}

function sendEvent(event: AnalyticsEvent) {
  const body = JSON.stringify(event);

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon(analyticsEndpoint(), blob);
    return;
  }

  fetch(analyticsEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body,
    keepalive: true
  }).catch(() => undefined);
}

export function AnalyticsTracker() {
  useEffect(() => {
    const sessionId = getSessionId();
    const pagePath = `${window.location.pathname}${window.location.search}`;

    sendEvent({
      type: "PAGE_VIEW",
      source: sourceFromUrl(),
      pagePath,
      sessionId,
      referrer: document.referrer || undefined
    });

    const handleClick = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const link = target.closest<HTMLAnchorElement>("a[data-analytics-target]");

      if (!link) {
        return;
      }

      sendEvent({
        type: "TELEGRAM_CLICK",
        source: link.dataset.analyticsSource ?? sourceFromUrl(),
        pagePath,
        target: link.dataset.analyticsTarget,
        sessionId,
        metadata: {
          href: link.href,
          text: link.textContent?.trim()
        }
      });
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
