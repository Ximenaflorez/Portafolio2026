import { Moon, Sun } from "lucide-react";
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
      {dark ? (
        <Moon data-icon="moon" aria-hidden focusable="false" className="ui-icon" />
      ) : (
        <Sun data-icon="sun" aria-hidden focusable="false" className="ui-icon" />
      )}
    </button>
  );
}
