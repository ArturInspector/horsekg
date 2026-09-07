"use client";

import { useEffect, useState } from "react";

type MobileBookingBarProps = {
  analyticsSource: string;
  analyticsTarget: string;
  href: string;
};

export function MobileBookingBar({
  analyticsSource,
  analyticsTarget,
  href
}: MobileBookingBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 620);

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  return (
    <div className={visible ? "mobileBookingBar visible" : "mobileBookingBar"}>
      <span>от 1 500 сом • 1-2 часа</span>
      <a
        href={href}
        data-analytics-source={analyticsSource}
        data-analytics-target={analyticsTarget}
      >
        Записаться
      </a>
    </div>
  );
}
