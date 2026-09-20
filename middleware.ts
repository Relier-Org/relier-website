import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

/**
 * Archivos de taxonomía del WordPress: 60 /tag/* y 2 /category/* quedaron
 * indexados, todos thin. El audit de SEO (ago-2026) pidió explícitamente NO
 * redirigirlos en masa a /blog/ — un 301 hacia un hub genérico no conserva
 * intención y retrasa la limpieza del índice. 410 Gone le dice a Google que la
 * URL murió a propósito, y lo procesa más rápido que un 404.
 *
 * Va en middleware y no en `next.config.mjs` porque `redirects()` sólo emite
 * 301/308 y además corre ANTES del middleware: si el redirect siguiera ahí,
 * esto nunca se ejecutaría.
 *
 * Mismo trato para las páginas demo del theme del WP (/demo-2/…/demo-11/,
 * /example-i/, /sample-page/, /test-addon-2/): siguen en el export de GSC, así
 * que Google las conoce; el roadmap de sep-2026 (T11) pide limpiarlas. Estaban
 * en 404 y 410 lo procesa más rápido.
 */
const GONE =
  /^\/(?:(?:en|es|pt)\/)?(?:tag|category|demo-\d+|example-i|sample-page|test-addon-2)(?:\/|$)/;

export default function middleware(request: NextRequest) {
  if (GONE.test(request.nextUrl.pathname)) {
    return new NextResponse(null, {
      status: 410,
      headers: { "X-Robots-Tag": "noindex" },
    });
  }
  return intlMiddleware(request);
}

export const config = {
  // Skip /api, Next internals, Vercel internals and any path with a file
  // extension (images, icons, fonts, etc.).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
