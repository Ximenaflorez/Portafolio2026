import { useEffect, useState } from "react";

// Píldora de 44 px, solo en teléfono y solo tras bajar una pantalla. El salto usa el
// scroll del documento: suave, o instantáneo si se pidió reducir el movimiento.
const box =
  "fixed bottom-3 right-3 z-10 inline-flex min-h-target min-w-target items-center justify-center rounded-button border border-primary bg-primary text-on-primary sm:hidden after:pointer-events-none after:absolute after:inset-0 after:rounded-inherit after:bg-on-primary after:content-empty after:opacity-0 after:transition-opacity after:duration-state hover:after:opacity-state-hover active:after:opacity-state-press";

export function BackToTop({ label }: { label: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => window.scrollTo({ top: 0 })}
      className={box}
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3 w-3"
      >
        <path d="M12 19V5M6 11l6-6 6 6" />
      </svg>
    </button>
  );
}
