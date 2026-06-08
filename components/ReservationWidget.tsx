"use client";

import { useEffect, useRef } from "react";

const EXPANDER_SRC =
  "https://relier.mylimobiz.com/leads/new/forms/resize/expander.php";

export type ReservationWidgetProps = {
  /** LQC form config id from the Limo Anywhere panel. */
  configId?: string;
  className?: string;
};

export default function ReservationWidget({
  configId = "13",
  className,
}: ReservationWidgetProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    // Guard against StrictMode's dev double-mount / HMR: clear the form mount
    // before injecting so we never stack two copies.
    inner.innerHTML = "";

    // The expander reads its config from the <script> tag's `config` attribute
    // (next/script normalizes it away, so we build the tag by hand). config is
    // also mirrored into the query string as the expander's documented
    // fallback. The form itself mounts into #addons_inner per the Limo config.
    const script = document.createElement("script");
    script.src = `${EXPANDER_SRC}?config=${encodeURIComponent(configId)}`;
    script.setAttribute("config", configId);
    outer.appendChild(script);

    return () => {
      script.remove();
      inner.innerHTML = "";
    };
  }, [configId]);

  return (
    <div id="addons_outer" ref={outerRef} className={className}>
      <div id="addons_inner" ref={innerRef} />
    </div>
  );
}
