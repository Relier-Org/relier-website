"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

function formatDisplay(value: string): string {
  const [h, m] = value.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${pad(m)} ${ampm}`;
}

export default function TimePicker({
  value,
  onChange,
  intervalMinutes = 15,
  placeholder = "Select a time",
}: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

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
          {value ? formatDisplay(value) : placeholder}
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
