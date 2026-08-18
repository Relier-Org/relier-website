import Script from "next/script";
import { GA4_IDS } from "@/lib/analytics/config";

/**
 * GA4 via gtag.js.
 *
 * Wired directly rather than through GTM because neither of the client's
 * containers actually carries a GA4 tag — measured by loading each container in
 * isolation and watching what hit the wire. On WordPress, GA4 `G-CV2QZ9VV0M`
 * arrives through Google Site Kit's own `GT-NB9VDKSH` tag, which we have no
 * equivalent of here.
 *
 * If the performance team later adds a GA4 tag to GTM-KCLH74B7, drop
 * `NEXT_PUBLIC_GA4_ID` and this stops rendering — no code change needed.
 * Leaving both on would double-count every pageview.
 */
export default function GoogleAnalytics() {
  if (GA4_IDS.length === 0) return null;

  const [primary, ...extras] = GA4_IDS;

  return (
    <>
      <Script
        id="ga4-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${primary}`}
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {[
          "window.dataLayer = window.dataLayer || [];",
          "function gtag(){dataLayer.push(arguments);}",
          "gtag('js', new Date());",
          // send_page_view stays on: this fires the first pageview. Client-side
          // navigations after it are handled by RouteChangeTracker.
          ...[primary, ...extras].map(
            (id) => `gtag('config', '${id}', { cookie_flags: 'SameSite=None;Secure' });`
          ),
        ].join("\n")}
      </Script>
    </>
  );
}
