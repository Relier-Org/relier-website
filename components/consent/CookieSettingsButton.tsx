"use client";

import { openConsentPreferences } from "@/lib/consent/state";

/** "Cookie settings" del footer: reabre el panel del banner (CookieBanner). */
export default function CookieSettingsButton({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={openConsentPreferences}
      aria-haspopup="dialog"
    >
      {label}
    </button>
  );
}
