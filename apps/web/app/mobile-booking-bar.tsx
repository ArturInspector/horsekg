"use client";

type MobileBookingBarProps = {
  analyticsSource: string;
  analyticsTarget: string;
  href: string;
  price: string;
  summary: string;
};

export function MobileBookingBar({
  analyticsSource,
  analyticsTarget,
  href,
  price,
  summary
}: MobileBookingBarProps) {
  return (
    <div className="mobileBookingBar visible">
      <span>
        <b>{price}</b>
        <small>{summary}</small>
      </span>
      <a
        href={href}
        data-analytics-source={analyticsSource}
        data-analytics-target={analyticsTarget}
      >
        Проверить
      </a>
    </div>
  );
}
