"use client";

import { CalendarDays } from "lucide-react";
import { useMemo, useState } from "react";
import { siteCopy } from "../content/landing";
import {
  type BookingIntentSelection,
  createBookingIntentMetadata,
  metadataJson
} from "../lib/booking-intent";

type BookingIntentPickerProps = {
  analyticsSource: string;
  analyticsTarget: string;
  className?: string;
  ctaLabel: string;
  href: string;
  surface: string;
};

function initialSelection() {
  return Object.fromEntries(
    siteCopy.bookingPanel.fields.map((field) => [field.label, field.options[0]])
  );
}

export function BookingIntentPicker({
  analyticsSource,
  analyticsTarget,
  className = "",
  ctaLabel,
  href,
  surface
}: BookingIntentPickerProps) {
  const [selection, setSelection] = useState<BookingIntentSelection>(() =>
    initialSelection()
  );
  const metadata = useMemo(
    () => metadataJson(createBookingIntentMetadata(selection, surface)),
    [selection, surface]
  );
  const summary = [
    selection["Когда"],
    selection["Локация"],
    selection["Участники"],
    selection["Длительность"]
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <aside
      className={["bookingPanel", className].filter(Boolean).join(" ")}
      aria-label={siteCopy.bookingPanel.title}
    >
      <div className="bookingPanelTop">
        <p>{siteCopy.bookingPanel.title}</p>
        <strong>{siteCopy.bookingPanel.price}</strong>
      </div>
      <div className="bookingFields">
        {siteCopy.bookingPanel.fields.map((field) => (
          <div className="bookingField" key={field.label}>
            <span>{field.label}</span>
            <strong>{selection[field.label]}</strong>
            <div className="choiceRow" aria-label={field.label}>
              {field.options.map((option) => (
                <button
                  aria-pressed={selection[field.label] === option}
                  className={selection[field.label] === option ? "selected" : undefined}
                  key={option}
                  onClick={() =>
                    setSelection((current) => ({
                      ...current,
                      [field.label]: option
                    }))
                  }
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="bookingSummary">{summary}</p>
      <a
        className="v2Button dark full"
        href={href}
        data-analytics-source={analyticsSource}
        data-analytics-target={analyticsTarget}
        data-analytics-metadata={metadata}
      >
        {ctaLabel}
        <CalendarDays size={18} />
      </a>
      <p className="bookingNote">{siteCopy.bookingPanel.note}</p>
    </aside>
  );
}
