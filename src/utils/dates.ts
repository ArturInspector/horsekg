const bishkekTimeZone = "Asia/Bishkek";

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: bishkekTimeZone,
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(value);
}

export function formatTimeRange(startsAt: Date, endsAt: Date) {
  const date = new Intl.DateTimeFormat("ru-RU", {
    timeZone: bishkekTimeZone,
    weekday: "short",
    day: "2-digit",
    month: "short"
  }).format(startsAt);
  const time = new Intl.DateTimeFormat("ru-RU", {
    timeZone: bishkekTimeZone,
    hour: "2-digit",
    minute: "2-digit"
  });

  return `${date}, ${time.format(startsAt)}-${time.format(endsAt)}`;
}

export function parseDate(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed;
}
