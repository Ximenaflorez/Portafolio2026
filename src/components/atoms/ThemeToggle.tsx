import { useSyncExternalStore } from "react";
import { currentTheme, subscribeTheme, toggleTheme } from "~/lib/theme";

const noop = () => () => {};

// El nombre accesible es siempre el mismo y el estado lo da `aria-pressed`; el ícono solo
// refuerza visualmente el tema que se ve (sol con el claro, luna con el oscuro).
export function ThemeToggle({ label }: { label: string }) {
  // Sin JavaScript el botón no haría nada: el servidor solo reserva su lugar en el encabezado.
  const hydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const theme = useSyncExternalStore(subscribeTheme, currentTheme, () => "light" as const);

  const box = "inline-flex min-h-target min-w-target items-center justify-center";
  if (!hydrated) return <span className={box} aria-hidden="true" />;

  const dark = theme === "dark";
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={dark}
      onClick={toggleTheme}
      className={`${box} text-text transition-colors duration-state hover:text-primary-hover active:text-primary-active`}
    >
      <svg
        data-icon={dark ? "moon" : "sun"}
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
        {dark ? (
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        )}
      </svg>
    </button>
  );
}
