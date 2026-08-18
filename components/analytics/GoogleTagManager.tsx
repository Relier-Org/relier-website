import Script from "next/script";
import { GTM_ID } from "@/lib/analytics/config";

/**
 * Google Tag Manager container.
 *
 * One container is all we install. Everything else the performance team runs —
 * GA4 `G-CV2QZ9VV0M`, Meta pixel `4423881761234988`, Google Ads
 * `AW-17772455341` — is configured *inside* the container and resolves at
 * runtime (GA4 and Ads arrive as destinations of a Google tag, which is why
 * grepping the container source doesn't show the GA4 id). Hardcoding a gtag or
 * fbq snippet on top would double-count every pageview and every conversion.
 *
 * The id comes from `NEXT_PUBLIC_GTM_ID`. Unset means no tracking at all, which
 * is what we want in local dev — nobody's `npm run dev` should land in the
 * client's reports.
 */
export default function GoogleTagManager() {
  if (!GTM_ID) return null;

  return (
    <>
      <Script id="gtm-init" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
}
