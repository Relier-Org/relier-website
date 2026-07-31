"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import styles from "./TimePicker.module.css";

type TimePickerProps = {
  value: string | null; // "HH:MM" 24h
  onChange: (value: string | null) => void;
  intervalMinutes?: number;
  placeholder?: string;
};

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function TimePicker({
  value,
  onChange,
  intervalMinutes = 15,
  placeholder,
}: TimePickerProps) {
  const t = useTranslations("booking");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // hour12 vs 24h follows the locale (en → 12h AM/PM, es/pt → 24h).
  const timeFormat = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" }),
    [locale]
  );
  const formatDisplay = useCallback(
    (val: string) => {
      const [h, m] = val.split(":").map(Number);
      return timeFormat.format(new Date(2000, 0, 1, h, m));
    },
    [timeFormat]
  );

  const options = useMemo(() => {
    const out: string[] = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += intervalMinutes) {
        out.push(`${pad(h)}:${pad(m)}`);
      }
    }
    return out;
  }, [intervalMinutes]);

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

  useEffect(() => {
    if (!open || !listRef.current) return;
    const selected = listRef.current.querySelector<HTMLElement>(
      `[data-selected="true"]`
    );
    if (selected) {
      selected.scrollIntoView({ block: "center" });
    }
  }, [open]);

  function commit(opt: string) {
    onChange(opt);
    setOpen(false);
  }

  return (
    <div className={styles.wrap} ref={wrapperRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={value ? styles.value : styles.placeholder}>
          {value ? formatDisplay(value) : placeholder ?? t("timePicker.placeholder")}
        </span>
      </button>
      {open && (
        <div className={styles.popover} role="listbox" ref={listRef}>
          {options.map((opt) => {
            const isSelected = opt === value;
            return (
              <button
                key={opt}
                type="button"
                role="option"
                aria-selected={isSelected}
                data-selected={isSelected}
                className={`${styles.option} ${isSelected ? styles.optionSelected : ""}`}
                onClick={() => commit(opt)}
              >
                {formatDisplay(opt)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
