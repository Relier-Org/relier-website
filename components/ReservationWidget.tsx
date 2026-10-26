'use client';
import { useEffect, useRef, useState } from 'react';
import { preconnect, preload } from 'react-dom';
import { cn } from '@/lib/utils/cn';
import {
  BOOKING_STEP_EVENT,
  isBookingMessage,
  readBookingPurchase,
  readBookingStep,
  trackBookingConversion,
} from '@/lib/booking/conversion';
import { hasConsent } from '@/lib/consent/state';
import { GTM_ID } from '@/lib/analytics/config';
import styles from './ReservationWidget.module.css';

// Limo Anywhere's classic tag only runs once per document. The manual loader
// registers <la-quote-form>, which mounts again after Next.js client navigation.
const SCRIPT_SRC = 'https://relier.mylimobiz.com/leads/new/forms/resize/expander.php?manual=1&config=13';
const SCRIPT_ID = 'la-embed-manual-loader';

// If the embed never reports in (host missing from Limo Anywhere's whitelist →
// 403 on config.php, or plain network failure) reveal the container anyway
// rather than leaving a permanently invisible form.
const REVEAL_FALLBACK_MS = 6000;

export default function ReservationWidget({
  configId = '13',
  className,
}: { configId?: string; className?: string }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  // Begin downloading the loader before hydration starts.
  preload(SCRIPT_SRC, { as: 'script' });
  preconnect('https://relier.addons.la');
  preconnect('https://cdn.addons.la');

  // Ready signal, kept separate from the injection effect so a re-run of one
  // never re-runs the other.
  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    let done = false;
    const settle = () => {
      if (done) return;
      done = true;
      setReady(true);
    };

    // Primary signal: the form posts its measured height once it has painted.
    const onMessage = (event: MessageEvent) => {
      const frame = outer.querySelector('la-quote-form')?.shadowRoot?.querySelector('iframe');
      if (!isBookingMessage(event, frame)) return;

      const purchase = readBookingPurchase(event.data);
      if (purchase && GTM_ID && hasConsent("marketing")) {
        trackBookingConversion(purchase, (conversion) => {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push(conversion);
        });
      }

      const step = readBookingStep(event.data);
      if (step && GTM_ID && hasConsent("marketing")) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: BOOKING_STEP_EVENT, booking_provider: 'limo_anywhere', booking_step: step });
      }

      let data: { height?: string };
      try {
        data = JSON.parse(event.data?.message);
      } catch {
        return;
      }
      const height = parseFloat(String(data?.height ?? ''));
      if (height > 0) {
        // La caja toma el alto que informa el form y lo sostiene (perf
        // oct-2026, CLS): el iframe arranca más alto y se achica animado, y
        // sin este tope cada paso de esa animación empujaba al hero. +3px: el
        // hueco de línea base del iframe inline, medido igual en todos los anchos.
        frameRef.current?.style.setProperty('--embed-placeholder', `${Math.ceil(height) + 3}px`);
        frameRef.current?.setAttribute('data-locked', 'true');
        settle();
      }
    };
    window.addEventListener('message', onMessage);

    // Fallback: wait for the custom element upgrade, then watch its shadow root.
    let disposed = false;
    let observer: MutationObserver | undefined;
    let loadTimer: number | undefined;
    void customElements.whenDefined('la-quote-form').then(() => {
      if (disposed) return;
      const host = outer.querySelector('la-quote-form');
      if (!host?.shadowRoot) return;
      const watchFrame = () => {
        const frame = host.shadowRoot?.querySelector('iframe');
        if (!frame) return;
        observer?.disconnect();
        frame.addEventListener('load', () => {
          loadTimer = window.setTimeout(settle, 400);
        }, {
          once: true,
        });
      };
      observer = new MutationObserver(watchFrame);
      observer.observe(host.shadowRoot, { childList: true, subtree: true });
      watchFrame();
    });

    const timeout = window.setTimeout(settle, REVEAL_FALLBACK_MS);

    return () => {
      disposed = true;
      window.removeEventListener('message', onMessage);
      observer?.disconnect();
      if (loadTimer !== undefined) window.clearTimeout(loadTimer);
      window.clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;
    const inner = outer.querySelector('#addons_inner');
    if (!inner) return;

    const form = document.createElement('la-quote-form');
    form.setAttribute('config', configId);
    inner.appendChild(form);

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = SCRIPT_SRC;
      script.async = true;
      document.head.appendChild(script);
    }

    return () => {
      form.remove();
    };
  }, [configId]);

  return (
    <div
      ref={frameRef}
      className={cn(styles.frame, className)}
      data-ready={ready ? 'true' : undefined}
    >
      <span className={styles.skeleton} aria-hidden="true" />
      {/* The outer selector is used by Limo Anywhere when the form expands. */}
      <div id="addons_outer" ref={outerRef} className={styles.root}>
        <div id="addons_inner" />
      </div>
    </div>
  );
}
