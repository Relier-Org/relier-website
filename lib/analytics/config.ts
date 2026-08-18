// Analytics ids. All of these are public by definition — they ship in the page
// source — so `NEXT_PUBLIC_` is correct here and carries no secret.
//
// What the legacy WordPress site loads, for reference (measured 18-ago-2026):
//   GTM-KCLH74B7   -> Google Ads AW-17772455341 + Meta pixel 4423881761234988
//   GTM-T7N9T6J9   -> Google Ads AW-17772455341 (nothing KCLH74B7 doesn't do)
//   gtag G-JZE4S6VRG3 -> GA4 G-JZE4S6VRG3 + GA4 G-13FRG3L2MP + Ads AW-10836195222
//   Site Kit GT-NB9VDKSH -> GA4 G-CV2QZ9VV0M
// Neither GTM container carries a GA4 tag, which is why GA4 is wired directly
// here instead of being left to the container.

/** GTM container. Carries Google Ads + the Meta pixel. */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID?.trim() || "";

/**
 * GA4 measurement ids, comma-separated. The first one owns the gtag.js load;
 * the rest are configured as extra destinations, which is how you send the same
 * hits to a legacy property without loading gtag twice.
 */
export const GA4_IDS = (process.env.NEXT_PUBLIC_GA4_ID ?? "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

export const analyticsEnabled = Boolean(GTM_ID) || GA4_IDS.length > 0;
