"use client";

import { CalendarDays, Clock3, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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

function routeForSelection(selection: BookingIntentSelection) {
  if (selection["Локация"] === "Аламедин") {
    return siteCopy.routes.find((route) => route.slug === "alamedin-horse-riding");
  }

  if (selection["Длительность"] === "2 часа") {
    return siteCopy.routes.find((route) => route.slug === "chunkurchak-mountain-route");
  }

  return siteCopy.routes.find((route) => route.slug === "chunkurchak-horse-riding");
}

function firstAvailableSlot(slots: readonly { time: string; state: string }[]) {
  return slots.find((slot) => slot.state !== "unavailable")?.time ?? slots[0]?.time ?? "";
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
  const selectedRoute = useMemo(() => routeForSelection(selection), [selection]);
  const routeAvailability = selectedRoute?.availability;
  const [selectedSlot, setSelectedSlot] = useState(() =>
    firstAvailableSlot(siteCopy.routes[0].availability.slots)
  );

  useEffect(() => {
    if (!routeAvailability) {
      return;
    }

    setSelectedSlot(firstAvailableSlot(routeAvailability.slots));
  }, [routeAvailability]);

  const metadata = useMemo(
    () =>
      metadataJson(
        createBookingIntentMetadata(selection, surface, {
          selectedRouteSlug: selectedRoute?.slug,
          selectedSlot,
          availabilityStatus: routeAvailability?.status,
          confirmationMode: routeAvailability?.confirmationMode,
          capacityMin: routeAvailability?.capacityMin,
          capacityMax: routeAvailability?.capacityMax,
          fallbackAlternatives: routeAvailability?.fallbackAlternatives
        })
      ),
    [routeAvailability, selectedRoute, selectedSlot, selection, surface]
  );
  const summary = [
    selection["Когда"],
    selection["Локация"],
    selection["Участники"],
    selection["Длительность"],
    selectedSlot
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
      {selectedRoute && routeAvailability ? (
        <section className="availabilityBox" aria-label="Доступность маршрута">
          <div className="availabilityBoxTop">
            <span>{siteCopy.bookingPanel.availability.title}</span>
            <strong>{selectedRoute.shortTitle}</strong>
          </div>
          <p className={`availabilityStatus ${routeAvailability.status}`}>
            <span aria-hidden="true" />
            {routeAvailability.statusLabel}
          </p>
          <div className="slotGrid" aria-label="Слоты">
            {routeAvailability.slots.map((slot) => (
              <button
                className={selectedSlot === slot.time ? "selected" : undefined}
                disabled={slot.state === "unavailable"}
                key={`${selectedRoute.slug}-${slot.time}`}
                onClick={() => setSelectedSlot(slot.time)}
                type="button"
              >
                <b>{slot.time}</b>
                <span>{slot.label}</span>
              </button>
            ))}
          </div>
          <dl className="availabilityMeta">
            <div>
              <dt>
                <UsersRound size={14} />
                Группа
              </dt>
              <dd>{routeAvailability.capacityLabel}</dd>
            </div>
            <div>
              <dt>
                <Clock3 size={14} />
                Режим
              </dt>
              <dd>{siteCopy.bookingPanel.availability.mode}</dd>
            </div>
          </dl>
          <p className="availabilityEmpty">
            {siteCopy.bookingPanel.availability.emptyState}
          </p>
        </section>
      ) : null}
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
