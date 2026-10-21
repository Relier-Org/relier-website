"use client";

import Button from "@/components/ui/Button";
import { openConsentPreferences } from "@/lib/consent/state";
import styles from "./CookieSettingsButton.module.css";

/** Reabre el panel de preferencias de cookies. El label llega del server:
 *  `legal` no está en clientNamespaces. */
export default function CookieSettingsButton({ label }: { label: string }) {
  return (
    <Button
      variant="secondary"
      type="button"
      onClick={openConsentPreferences}
      className={styles.button}
    >
      {label}
    </Button>
  );
}
