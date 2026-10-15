import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export const namespaces = [
  "common",
  "nav",
  "footer",
  "home",
  "booking",
  "services",
  "wc",
  "fleet",
  "pages",
  "blog",
  "landings",
] as const;

/**
 * Namespaces reachable from a "use client" component, i.e. the only ones that
 * have to be serialized into NextIntlClientProvider. Server components read
 * from the full request config instead, so `services`/`wc`/`footer` stay off
 * the wire (~20 KB per page). Add a namespace here when a client component
 * starts calling useTranslations() on it, or it will throw MISSING_MESSAGE.
 */
export const clientNamespaces = [
  "common",
  "nav",
  "home",
  "booking",
  "fleet",
  "pages",
  "blog",
] as const satisfies readonly (typeof namespaces)[number][];

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const entries = await Promise.all(
    namespaces.map(async (ns) => {
      const mod = await import(`@/messages/${locale}/${ns}.json`);
      return [ns, mod.default] as const;
    })
  );

  return {
    locale,
    messages: Object.fromEntries(entries),
  };
});
