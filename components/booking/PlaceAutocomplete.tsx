"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import { searchPlaces, type PlaceFeature } from "@/lib/booking/mapConfig";
import styles from "./PlaceAutocomplete.module.css";

type PlaceAutocompleteProps = {
  placeholder?: string;
  value: PlaceFeature | null;
  onSelect: (place: PlaceFeature | null) => void;
};

export default function PlaceAutocomplete({
  placeholder,
  value,
  onSelect,
}: PlaceAutocompleteProps) {
  const t = useTranslations("booking");
  const locale = useLocale();
  const [query, setQuery] = useState(value?.name ?? "");
  const [results, setResults] = useState<PlaceFeature[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const unknownLabel = t("placeAutocomplete.unknownPlace");

  useEffect(() => {
    if (value && value.name !== query) setQuery(value.name);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!query.trim() || query === value?.name) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const r = await searchPlaces(query, controller.signal, {
          locale,
          unknownLabel,
        });
        setResults(r);
        setHighlight(0);
      } catch (err) {
        if ((err as Error).name !== "AbortError") setResults([]);
      }
    }, 300);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query, value?.name, locale, unknownLabel]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function commit(place: PlaceFeature) {
    onSelect(place);
    setQuery(place.name);
    setResults([]);
    setIsOpen(false);
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = results[highlight];
      if (r) commit(r);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  const showDropdown = isOpen && results.length > 0;

  return (
    <div className={styles.wrap} ref={wrapperRef}>
      <input
        type="text"
        className={styles.input}
        placeholder={placeholder ?? t("placeAutocomplete.placeholder")}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
          if (value) onSelect(null);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKey}
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls={listboxId}
        aria-autocomplete="list"
        autoComplete="off"
      />
      {showDropdown && (
        <ul className={styles.list} id={listboxId} role="listbox">
          {results.map((r, i) => (
            <li
              key={r.id}
              role="option"
              aria-selected={i === highlight}
              className={`${styles.option} ${i === highlight ? styles.optionActive : ""}`}
              onMouseEnter={() => setHighlight(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                commit(r);
              }}
            >
              <span className={styles.optionPrimary}>{r.name}</span>
              {r.fullName !== r.name && (
                <span className={styles.optionSecondary}>{r.fullName}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
