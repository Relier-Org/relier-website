"use client";

import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils/cn";
import styles from "./BookingWidget.module.css";

type Tab = "one-way" | "by-the-hour";

const TABS: { id: Tab; label: string }[] = [
  { id: "one-way", label: "One way" },
  { id: "by-the-hour", label: "By the hour" },
];

export default function BookingWidget() {
  const [activeTab, setActiveTab] = useState<Tab>("one-way");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: wire to booking provider (likely Karhoo or Limos.com)
  }

  return (
    <div className={styles.booking} id="booking">
      <div className={styles.shell}>
        <div className={styles.tabs} role="tablist" aria-label="Booking type">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={cn(styles.tab, activeTab === tab.id && styles.tabActive)}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <form className={styles.fields} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Pickup location</span>
            <input type="text" placeholder="Address, airport, hotel..." />
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Drop-off location</span>
            <input type="text" placeholder="Address, airport, hotel..." />
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Date</span>
            <input type="text" placeholder="Select a date" />
            <span className={styles.fieldIcon} aria-hidden="true">▾</span>
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Pickup time</span>
            <input type="text" placeholder="3:45 PM" />
            <span className={styles.fieldIcon} aria-hidden="true">▾</span>
          </label>
          <button type="submit" className={styles.cta}>
            See options →
          </button>
        </form>
        <p className={styles.concierge}>
          Need help planning?{" "}
          <a href="tel:+18447354371">
            Talk to a concierge → +1 (844) 735-4371
          </a>
        </p>
      </div>
    </div>
  );
}
