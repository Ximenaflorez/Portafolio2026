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
      <svg
        data-icon={open ? "close" : "menu"}
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
        {open ? (
          <path d="M6 6l12 12M18 6L6 18" />
        ) : (
          <>
            <path d="M4 7h16M4 12h16M4 17h16" />
          </>
        )}
      </svg>
    </button>
  );
}
