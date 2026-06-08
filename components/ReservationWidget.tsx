'use client';
import { useEffect, useRef } from 'react';

const SCRIPT_SRC = 'https://relier.mylimobiz.com/leads/new/forms/resize/expander.php';

export default function ReservationWidget({
  configId = '13',
}: { configId?: string }) {
  const outerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;
    if (outer.dataset.laLoaded === 'true') return;

    outer.dataset.laLoaded = 'true';
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.setAttribute('config', configId);
    script.async = true;
    outer.appendChild(script);

    return () => {
      const inner = outer.querySelector('#addons_inner');
      if (inner) inner.innerHTML = '';
      outer.removeAttribute('data-la-loaded');
      script.remove();
    };
  }, [configId]);

  return (
    <div id="addons_outer" ref={outerRef}>
      <div id="addons_inner" />
    </div>
  );
}
