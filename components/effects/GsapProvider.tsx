"use client";

import { useEffect, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Registers the GSAP React plugin once per page tree.
 *
 * It used to also register ScrollTrigger and, on unmount, run
 * `ScrollTrigger.getAll().forEach(t => t.kill())`. Both are gone (11-aug-2026):
 *
 *  · Nothing uses ScrollTrigger any more — `Reveal` moved to an
 *    IntersectionObserver, which is the only place it was ever used. Dropping the
 *    import also takes the plugin out of the bundle.
 *  · That cleanup was a global kill switch. Every page mounts its own provider,
 *    so a client-side navigation could tear down the triggers the incoming page
 *    had just created and leave its content stuck at `opacity: 0`. `useGSAP`
 *    already reverts each component's own animations on unmount, scoped to that
 *    component — which is what cleanup should be.
 */
export default function GsapProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(useGSAP);
  }, []);

  return <>{children}</>;
}
