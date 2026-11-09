import { useEffect, useRef, useState, type CSSProperties } from "react";
import { publicUrl } from "~/lib/public-url";

type Shot = { src: string; alt: string; caption: string };

// La primera imagen es el antes y queda a la izquierda. La segunda es el después.
export function BeforeAfter({ before, after }: { before: Shot; after: Shot }) {
  const [value, setValue] = useState(88);
  const intro = useRef(0);

  useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (media?.matches) {
      setValue(50);
      return;
    }
    const start = performance.now();
    const duration = 1600;
    const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const next =
        t < 0.62 ? 88 + (12 - 88) * ease(t / 0.62) : 12 + (50 - 12) * ease((t - 0.62) / 0.38);
      setValue(Math.round(next));
      if (t < 1) intro.current = requestAnimationFrame(step);
    };
    intro.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(intro.current);
  }, []);

  function hold(next: number) {
    cancelAnimationFrame(intro.current);
    setValue(next);
  }

  if (before.alt.trim() === "" || after.alt.trim() === "") {
    throw new Error("BeforeAfter: faltan los textos alternativos");
  }

  return (
    <figure className="compare mt-4" style={{ "--compare": `${value}%` } as CSSProperties}>
      <div className="compare-stage overflow-hidden rounded-image border border-border">
        <img
          src={publicUrl(after.src)}
          alt={after.alt}
          width={1024}
          height={728}
          className="h-auto w-full"
        />
        <img
          src={publicUrl(before.src)}
          alt={before.alt}
          width={1024}
          height={728}
          className="compare-cover"
        />
        <input
          className="compare-range"
          type="range"
          min={0}
          max={100}
          value={value}
          aria-label={`${before.caption} / ${after.caption}`}
          onChange={(event) => hold(Number(event.target.value))}
          onPointerDown={() => cancelAnimationFrame(intro.current)}
        />
        <span className="compare-line" aria-hidden="true">
          <span className="compare-grip" />
        </span>
        <span className="pointer-events-none absolute left-3 top-3 rounded-button bg-surface px-2 py-1 text-sm">
          {before.caption}
        </span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-button bg-surface px-2 py-1 text-sm">
          {after.caption}
        </span>
      </div>
      <figcaption className="mt-1 text-sm text-text-muted">
        {`${before.caption} · ${after.caption}`}
      </figcaption>
    </figure>
  );
}
