'use client';
import { useEffect, useRef, useState } from 'react';
import { preconnect, preload } from 'react-dom';
import { cn } from '@/lib/utils/cn';
import { markEmbedReady } from '@/lib/booking/embedReady';
import styles from './ReservationWidget.module.css';

const SCRIPT_SRC = 'https://relier.mylimobiz.com/leads/new/forms/resize/expander.php';

// expander.php pulls this in itself (we never load jQuery), and it is the single
// biggest serial hop before the iframe is even requested. Hard-coded URL: if
// Limo Anywhere ever moves it the preload is wasted, not broken.
const EMBED_JQUERY = 'https://relier.addons.la/js/jquery-1.10.2.min.js';

// The expander derives its shortname from its own script host and only talks to
// these two origins; mirror that so no other frame can fake the ready signal.
const EMBED_ORIGINS = [
  'https://relier.addons.la',
  'https://relier.mylimobiz.com',
];

// If the embed never reports in (host missing from Limo Anywhere's whitelist →
// 403 on config.php, or plain network failure) reveal the container anyway
// rather than leaving a permanently invisible form.
const REVEAL_FALLBACK_MS = 6000;

export default function ReservationWidget({
  configId = '13',
  className,
}: { configId?: string; className?: string }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  // The whole chain — expander.php → jQuery → config.php → load.php → iframe →
  // the form's own bundles — is cross-origin and strictly serial. These hints
  // ship in the SSR head, so the download starts before React hydrates instead
  // of after, which is most of the wait the curtain is covering.
  preload(SCRIPT_SRC, { as: 'script' });
  preload(EMBED_JQUERY, { as: 'script' });
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
      markEmbedReady();
    };

    // Primary signal: the form posts its measured height once it has painted.
    const onMessage = (event: MessageEvent) => {
      if (!EMBED_ORIGINS.includes(event.origin)) return;
      let data: { height?: string };
      try {
        data = JSON.parse(event.data?.message);
      } catch {
        return;
      }
      if (parseInt(String(data?.height ?? ''), 10) > 0) settle();
    };
    window.addEventListener('message', onMessage);

    // Fallback: the iframe's own load event. Cross-origin still fires it on the
    // parent, it just says nothing about paint — hence the short grace period.
    const observer = new MutationObserver(() => {
      const frame = outer.querySelector<HTMLIFrameElement>('#artusmode_filecontainer');
      if (!frame) return;
      observer.disconnect();
      frame.addEventListener('load', () => window.setTimeout(settle, 400), {
        once: true,
      });
    });
    observer.observe(outer, { childList: true, subtree: true });

    const timeout = window.setTimeout(settle, REVEAL_FALLBACK_MS);

    return () => {
      window.removeEventListener('message', onMessage);
      observer.disconnect();
      window.clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;
    if (outer.dataset.laLoaded === 'true') return;

    outer.dataset.laLoaded = 'true';

    // expander.php keeps `load_id` as a top-level global and its load() starts
    // with `if (load_id) return`. On a client-side nav between two pages that
    // both embed the form, the script is evaluated a second time in the same
    // document, sees the old id and bails before injecting the iframe — the bar
    // silently renders empty. Clearing it makes the re-run behave like a first
    // run. (Assignment, not delete: `var` globals aren't configurable.)
    (window as unknown as { load_id?: unknown }).load_id = undefined;

    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.setAttribute('config', configId);
    script.async = true;
    outer.appendChild(script);

    return () => {
      const inner = outer.querySelector('#addons_inner');
      if (inner) inner.innerHTML = '';
      outer.removeAttribute('data-la-loaded');
      script.remove();
    };
  }, [configId]);

  return (
    <div
      className={cn(styles.frame, className)}
      data-ready={ready ? 'true' : undefined}
    >
      <span className={styles.skeleton} aria-hidden="true" />
      {/* Both ids come from the Limo Anywhere config (outer_selector /
          inner_div) — renaming them breaks the injection and the resize. */}
      <div id="addons_outer" ref={outerRef} className={styles.root}>
        <div id="addons_inner" />
      </div>
    </div>
  );
}
