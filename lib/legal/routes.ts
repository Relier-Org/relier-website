// Las cinco páginas legales. `key` es la rama de messages `legal.<key>`;
// `path` es el pathname sin locale que usan `localeAlternates` y el sitemap.

export type LegalPageKey = "privacy" | "terms" | "cookies" | "refund" | "accessibility";

export const LEGAL_ROUTES: { key: LegalPageKey; path: string }[] = [
  { key: "privacy", path: "/privacy-policy" },
  { key: "terms", path: "/terms-and-conditions" },
  { key: "cookies", path: "/cookie-policy" },
  { key: "refund", path: "/refund-policy" },
  { key: "accessibility", path: "/accessibility" },
];

export const legalPath = (key: LegalPageKey) =>
  LEGAL_ROUTES.find((r) => r.key === key)!.path;
