import type { ReactNode } from "react";
import { ArrowUpRight, Download } from "lucide-react";
import { publicUrl } from "~/lib/public-url";
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
  const Icon = kind === "download" ? Download : ArrowUpRight;
  return <Icon aria-hidden focusable="false" className="ui-icon" />;
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
  const cvHref = cv ? publicUrl(cv) : undefined;

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
        {cvHref && (
          <li>
            <Action href={cvHref} variant="secondary" download icon="download">
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
      {cvHref && (
        <li>
          <TextLink variant="standalone" href={cvHref} download>
            {cvLabel}
          </TextLink>
        </li>
      )}
    </ul>
  );
}
