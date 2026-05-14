"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./DatePicker.module.css";

type DatePickerProps = {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getCalendarGrid(year: number, month: number): Date[] {
  const firstOfMonth = new Date(year, month, 1);
  const startDay = firstOfMonth.getDay(); // 0=Sun
  const offsetToMonday = (startDay + 6) % 7;
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    days.push(new Date(year, month, 1 - offsetToMonday + i));
  }
  return days;
}

function formatDisplay(d: Date): string {
  return `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}`;
}

export default function DatePicker({
  value,
  onChange,
  placeholder = "Select a date",
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const today = useMemo(() => startOfDay(new Date()), []);
  const [viewYear, setViewYear] = useState(
    value?.getFullYear() ?? today.getFullYear()
  );
  const [viewMonth, setViewMonth] = useState(
    value?.getMonth() ?? today.getMonth()
  );
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", onClickOutside);
      document.addEventListener("keydown", onKey);
      return () => {
        document.removeEventListener("mousedown", onClickOutside);
        document.removeEventListener("keydown", onKey);
      };
    }
  }, [open]);

  const grid = useMemo(
    () => getCalendarGrid(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  function goPrev() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function goNext() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function commit(d: Date) {
    onChange(startOfDay(d));
    setOpen(false);
  }

  return (
    <div className={styles.wrap} ref={wrapperRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className={value ? styles.value : styles.placeholder}>
          {value ? formatDisplay(value) : placeholder}
        </span>
      </button>
      {open && (
        <div className={styles.popover} role="dialog" aria-label="Select date">
          <div className={styles.header}>
            <button
              type="button"
              className={styles.navBtn}
              onClick={goPrev}
              aria-label="Previous month"
            >
              ‹
            </button>
            <span className={styles.title}>
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              className={styles.navBtn}
              onClick={goNext}
              aria-label="Next month"
            >
              ›
            </button>
          </div>
          <div className={styles.weekdays}>
            {WEEKDAYS.map((w) => (
              <span key={w} className={styles.weekday}>
                {w}
              </span>
            ))}
          </div>
          <div className={styles.grid}>
            {grid.map((d) => {
              const inMonth = d.getMonth() === viewMonth;
              const isPast = d < today;
              const isToday = isSameDay(d, today);
              const isSelected = value ? isSameDay(d, value) : false;
              const classes = [
                styles.day,
                !inMonth ? styles.dayOut : "",
                isPast ? styles.dayDisabled : "",
                isToday ? styles.dayToday : "",
                isSelected ? styles.daySelected : "",
              ]
                .filter(Boolean)
                .join(" ");
              return (
                <button
                  key={d.toISOString()}
                  type="button"
                  className={classes}
                  disabled={isPast}
                  onClick={() => commit(d)}
                  aria-pressed={isSelected}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
