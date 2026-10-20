import type { ReactNode } from "react";
import { Button } from "../atoms/Button";
import { TextLink } from "../atoms/TextLink";

type Props = {
  email: string;
  linkedin: string;
  /** Ruta o URL del CV; sin ella (el archivo falta) no se muestra su enlace. */
  cv?: string;
  label: string;
  cvLabel: string;
  /** En `actions`, el correo se etiqueta (p. ej. «Email») en vez de mostrar la dirección. */
  emailLabel?: string;
  /** `links` en el pie; `actions` son las píldoras de la sección Contacto. */
  variant?: "links" | "actions";
  className?: string;
};

function ActionIcon({ kind }: { kind: "external" | "download" }) {
  return (
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
      {kind === "download" ? (
        <>
          <path d="M12 4v12" />
          <path d="M8 12l4 4 4-4" />
          <path d="M5 20h14" />
        </>
      ) : (
        <path d="M7 17L17 7M10 7h7v7" />
      )}
    </svg>
  );
}

function Action({
  href,
  variant,
  download,
  children,
  icon,
}: {
  href: string;
  variant: "primary" | "secondary";
  download?: boolean;
  children: ReactNode;
  icon: "external" | "download";
}) {
  return (
    <Button variant={variant} href={href} download={download}>
      {children}
      <ActionIcon kind={icon} />
    </Button>
  );
}

// Solo enlaces, sin formulario (FR-034).
export function ContactList({
  email,
  linkedin,
  cv,
  label,
  cvLabel,
  emailLabel,
  variant = "links",
  className = "",
}: Props) {
  if (variant === "actions") {
    return (
      <ul className={className || undefined} aria-label={label}>
        <li>
          <Action href={`mailto:${email}`} variant="primary" icon="external">
            {emailLabel ?? email}
          </Action>
        </li>
        <li>
          <Action href={linkedin} variant="secondary" icon="external">
            LinkedIn
          </Action>
        </li>
        {cv && (
          <li>
            <Action href={cv} variant="secondary" download icon="download">
              {cvLabel}
            </Action>
          </li>
        )}
      </ul>
    );
  }

  return (
    <ul className={className || undefined} aria-label={label}>
      <li>
        <TextLink variant="standalone" href={`mailto:${email}`}>
          {email}
        </TextLink>
      </li>
      <li>
        <TextLink variant="standalone" href={linkedin}>
          LinkedIn
        </TextLink>
      </li>
      {cv && (
        <li>
          <TextLink variant="standalone" href={cv} download>
            {cvLabel}
          </TextLink>
        </li>
      )}
    </ul>
  );
}
