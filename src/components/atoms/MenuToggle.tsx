import { Menu, X } from "lucide-react";

type Props = {
  open: boolean;
  openLabel: string;
  closeLabel: string;
  controls: string;
  onClick: () => void;
};

const box =
  "inline-flex min-h-target min-w-target items-center justify-center text-text transition-colors duration-state hover:text-primary-hover active:text-primary-active sm:hidden";

// Solo en teléfono: desde `sm` la navegación va en fila y este control se oculta.
export function MenuToggle({ open, openLabel, closeLabel, controls, onClick }: Props) {
  return (
    <button
      type="button"
      aria-label={open ? closeLabel : openLabel}
      aria-expanded={open}
      aria-controls={controls}
      onClick={onClick}
      className={box}
    >
      {open ? (
        <X data-icon="close" aria-hidden focusable="false" className="h-3 w-3" />
      ) : (
        <Menu data-icon="menu" aria-hidden focusable="false" className="h-3 w-3" />
      )}
    </button>
  );
}
