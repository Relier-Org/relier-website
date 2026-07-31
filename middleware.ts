import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip /api, Next internals, Vercel internals and any path with a file
  // extension (images, icons, fonts, etc.).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
