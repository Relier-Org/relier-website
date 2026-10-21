import ConsentTags from "./ConsentTags";
import { GA4_IDS, GTM_ID, analyticsEnabled } from "@/lib/analytics/config";

/**
 * Single entry point for every tag on the site. Renders nothing when no id is
 * configured, which is the default locally — nobody's `npm run dev` should land
 * in the client's reports.
 *
 * Opt-in global (oct-2026): nothing loads before consent. GA4 needs the
 * `analytics` category and GTM (Ads + Meta) needs `marketing`; ConsentTags
 * injects each one client-side once granted. See components/analytics/tags.ts.
 *
 * There is deliberately no route-change hook here. Both layers already handle
 * App Router client-side navigation on their own, which was measured rather than
 * assumed:
 *   - GA4 enhanced measurement fires its own `page_view` on history change. An
 *     extra manual `gtag('event','page_view')` produced two hits for one
 *     navigation.
 *   - GTM pushes `gtm.historyChange-v2` into the dataLayer natively, so a custom
 *     `spa_page_view` event would be a second name for something that is
 *     already there.
 *
 * What is NOT covered: the Ads and Meta tags inside the container fire on
 * container load only, so they undercount client-side navigations. Fixing that
 * is a container-side change — add a History Change trigger to those tags in
 * GTM — not something this file can do.
 */
export default function Analytics() {
  if (!analyticsEnabled) return null;

  return <ConsentTags gtmId={GTM_ID} ga4Ids={GA4_IDS} />;
}
