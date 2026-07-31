"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./DurationPicker.module.css";

type DurationPickerProps = {
  value: number | null; // hours
  onChange: (hours: number | null) => void;
  placeholder?: string;
};

const HOUR_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 24];

export default function DurationPicker({
  value,
  onChange,
  placeholder,
}: DurationPickerProps) {
  const t = useTranslations("booking");
  const [open, setOpen] = useState(false);
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

  function commit(h: number) {
    onChange(h);
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
        <span className={value !== null ? styles.value : styles.placeholder}>
          {value !== null
            ? t("durationPicker.hours", { count: value })
            : placeholder ?? t("durationPicker.placeholder")}
        </span>
      </button>
      {open && (
        <div className={styles.popover} role="listbox">
          {HOUR_OPTIONS.map((h) => {
            const isSelected = h === value;
            return (
              <button
                key={h}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`${styles.option} ${isSelected ? styles.optionSelected : ""}`}
                onClick={() => commit(h)}
              >
                {t("durationPicker.hours", { count: h })}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
