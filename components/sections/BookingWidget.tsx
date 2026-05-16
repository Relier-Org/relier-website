"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "@/lib/utils/cn";
import PlaceAutocomplete from "@/components/booking/PlaceAutocomplete";
import DatePicker from "@/components/booking/DatePicker";
import TimePicker from "@/components/booking/TimePicker";
import DurationPicker from "@/components/booking/DurationPicker";
import Checkbox from "@/components/booking/Checkbox";
import type { PlaceFeature } from "@/lib/booking/mapConfig";
import styles from "./BookingWidget.module.css";

const RouteMap = dynamic(() => import("@/components/booking/RouteMap"), {
  ssr: false,
});

type Tab = "point-to-point" | "hourly";

const TABS: { id: Tab; label: string }[] = [
  { id: "point-to-point", label: "Point to Point" },
  { id: "hourly", label: "Hourly" },
];

export default function BookingWidget() {
  const [activeTab, setActiveTab] = useState<Tab>("point-to-point");
  const [pickup, setPickup] = useState<PlaceFeature | null>(null);
  const [dropoff, setDropoff] = useState<PlaceFeature | null>(null);
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [pickupTime, setPickupTime] = useState<string | null>(null);
  const [durationHours, setDurationHours] = useState<number | null>(null);
  const [returnTrip, setReturnTrip] = useState(false);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [returnTime, setReturnTime] = useState<string | null>(null);

  const tabsRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const tabRefs = useRef<Record<Tab, HTMLButtonElement | null>>({
    "point-to-point": null,
    hourly: null,
  });
  const hasInitRef = useRef(false);
  const mapPanelRef = useRef<HTMLDivElement>(null);
  const returnRowRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const [returnWidth, setReturnWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const measure = () => {
      const cells = form.children;
      const first = cells[0] as HTMLElement | undefined;
      const second = cells[1] as HTMLElement | undefined;
      if (first && second) {
        const width =
          second.offsetLeft + second.offsetWidth - first.offsetLeft;
        setReturnWidth(width);
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(form);
    return () => ro.disconnect();
  }, [activeTab]);

  const isPointToPoint = activeTab === "point-to-point";
  const hasRoute = isPointToPoint && pickup !== null && dropoff !== null;

  useGSAP(
    () => {
      const target = tabRefs.current[activeTab];
      const indicator = indicatorRef.current;
      if (!target || !indicator) return;

      const x = target.offsetLeft;
      const width = target.offsetWidth;

      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!hasInitRef.current || reduced) {
        gsap.set(indicator, { x, width });
        hasInitRef.current = true;
        return;
      }

      gsap.to(indicator, {
        x,
        width,
        duration: 0.3,
        ease: "back.out(1.4)",
      });
    },
    { dependencies: [activeTab] }
  );

  useGSAP(
    () => {
      const row = returnRowRef.current;
      if (!row || !returnTrip || !isPointToPoint) return;

      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      gsap.fromTo(
        row,
        { opacity: 0, y: reduced ? 0 : -8 },
        {
          opacity: 1,
          y: 0,
          duration: reduced ? 0 : 0.45,
          ease: "expo.out",
        }
      );
    },
    { dependencies: [returnTrip, isPointToPoint] }
  );

  useGSAP(
    () => {
      const panel = mapPanelRef.current;
      if (!panel || !hasRoute) return;

      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      gsap.fromTo(
        panel,
        { opacity: 0, y: reduced ? 0 : 16 },
        {
          opacity: 1,
          y: 0,
          duration: reduced ? 0 : 0.55,
          ease: "expo.out",
        }
      );

      const shell = shellRef.current;
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      if (shell && isDesktop) {
        const runScroll = () => {
          const nav = document.querySelector("nav");
          const navHeight = nav?.getBoundingClientRect().height ?? 80;
          const shellRect = shell.getBoundingClientRect();
          const availableHeight = window.innerHeight - navHeight;
          // Center the whole booking section vertically in the space below nav.
          // If it's taller than available, pin to top with a generous buffer
          // so the hero subtitle doesn't kiss the shell.
          const verticalCenter = Math.max(
            48,
            (availableHeight - shellRect.height) / 2
          );
          const desiredTopInViewport = navHeight + verticalCenter;
          const top =
            shellRect.top + window.scrollY - desiredTopInViewport;
          window.scrollTo({
            top,
            behavior: reduced ? "auto" : "smooth",
          });
        };
        // Wait for the margin-top transition (0.55s) to settle before
        // measuring so the scroll target uses the final layout.
        if (reduced) {
          runScroll();
        } else {
          window.setTimeout(runScroll, 560);
        }
      }
    },
    { dependencies: [hasRoute] }
  );

  function handleFieldClick(e: MouseEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement;
    if (
      target.closest(
        "input, button, [role='option'], [role='listbox'], [role='dialog']"
      )
    ) {
      return;
    }
    const focusable = e.currentTarget.querySelector<
      HTMLInputElement | HTMLButtonElement
    >("input, button");
    if (!focusable) return;
    focusable.focus();
    if (focusable.tagName === "BUTTON") focusable.click();
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: wire to booking provider (likely Karhoo or Limos.com)
    const payload = isPointToPoint
      ? {
          mode: "point-to-point" as const,
          pickup,
          dropoff,
          pickupDate,
          pickupTime,
          returnTrip,
          returnDate: returnTrip ? returnDate : null,
          returnTime: returnTrip ? returnTime : null,
        }
      : {
          mode: "hourly" as const,
          pickup,
          durationHours,
          pickupDate,
          pickupTime,
        };
    // eslint-disable-next-line no-console
    console.log("booking payload", payload);
  }

  return (
    <div
      className={cn(styles.booking, hasRoute && styles.bookingExpanded)}
      id="booking"
    >
      <div className="container">
      <div className={styles.shell} ref={shellRef}>
        <div
          className={styles.tabs}
          role="tablist"
          aria-label="Booking type"
          ref={tabsRef}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              className={cn(styles.tab, activeTab === tab.id && styles.tabActive)}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
          <span
            ref={indicatorRef}
            className={styles.indicator}
            aria-hidden="true"
          />
        </div>
        <form
          ref={formRef}
          className={cn(styles.fields, isPointToPoint ? styles.fieldsP2P : styles.fieldsHourly)}
          onSubmit={handleSubmit}
        >
          <div className={styles.field} onClick={handleFieldClick}>
            <span className={styles.fieldLabel}>Pick-up location</span>
            <PlaceAutocomplete value={pickup} onSelect={setPickup} />
          </div>
          {isPointToPoint ? (
            <div className={styles.field} onClick={handleFieldClick}>
              <span className={styles.fieldLabel}>Destination</span>
              <PlaceAutocomplete value={dropoff} onSelect={setDropoff} />
            </div>
          ) : (
            <div className={styles.field} onClick={handleFieldClick}>
              <span className={styles.fieldLabel}>Duration</span>
              <DurationPicker value={durationHours} onChange={setDurationHours} />
              <span className={styles.fieldIcon} aria-hidden="true">▾</span>
            </div>
          )}
          <div className={styles.field} onClick={handleFieldClick}>
            <span className={styles.fieldLabel}>Date</span>
            <DatePicker value={pickupDate} onChange={setPickupDate} />
            <span className={styles.fieldIcon} aria-hidden="true">▾</span>
          </div>
          <div className={styles.field} onClick={handleFieldClick}>
            <span className={styles.fieldLabel}>Pickup time</span>
            <TimePicker value={pickupTime} onChange={setPickupTime} />
            <span className={styles.fieldIcon} aria-hidden="true">▾</span>
          </div>
          <button type="submit" className={styles.cta}>
            Get my prices <span className={styles.ctaArrow} aria-hidden="true">→</span>
          </button>
        </form>
        <div className={styles.bottomRow}>
          {isPointToPoint && (
            <Checkbox checked={returnTrip} onChange={setReturnTrip}>
              Add a return trip
            </Checkbox>
          )}
          <p className={styles.concierge}>
            Need help planning?{" "}
            <a href="tel:+18447354371">
              Talk to a concierge → +1 (844) 735-4371
            </a>
          </p>
        </div>
        {isPointToPoint && returnTrip && (
          <div
            ref={returnRowRef}
            className={cn(styles.fields, styles.fieldsReturn)}
            style={returnWidth ? { width: returnWidth } : undefined}
          >
            <div className={styles.field} onClick={handleFieldClick}>
              <span className={styles.fieldLabel}>Return date</span>
              <DatePicker value={returnDate} onChange={setReturnDate} />
              <span className={styles.fieldIcon} aria-hidden="true">▾</span>
            </div>
            <div className={styles.field} onClick={handleFieldClick}>
              <span className={styles.fieldLabel}>Return time</span>
              <TimePicker value={returnTime} onChange={setReturnTime} />
              <span className={styles.fieldIcon} aria-hidden="true">▾</span>
            </div>
          </div>
        )}
        {hasRoute && pickup && dropoff && (
          <div ref={mapPanelRef} className={styles.mapPanel}>
            <RouteMap pickup={pickup} dropoff={dropoff} />
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
