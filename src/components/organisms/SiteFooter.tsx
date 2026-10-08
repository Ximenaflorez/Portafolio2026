import type { Profile } from "~/content/schema";
import { TextLink } from "../atoms/TextLink";
type Props = {
  profile: Pick<Profile, "name" | "email" | "linkedin" | "cv">;
  /** Falso si el archivo del CV no existe: el enlace se oculta. */
  cvAvailable: boolean;
  /** Ruta del caso meta; si todavía no está publicado, no se muestra el enlace. */
  metaCaseHref?: string;
  year?: number;
};

export function SiteFooter({
  profile,
  cvAvailable,
  metaCaseHref,
  year = new Date().getFullYear(),
}: Props) {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-content flex-col gap-4 px-3 py-6 md:px-4">
        <ul className="flex flex-wrap gap-x-3" aria-label="Contacto">
          <li>
            <TextLink variant="standalone" href={`mailto:${profile.email}`}>
              {profile.email}
            </TextLink>
          </li>
          <li>
            <TextLink variant="standalone" href={profile.linkedin}>
              LinkedIn
            </TextLink>
          </li>
          {cvAvailable && (
            <li>
              <TextLink variant="standalone" href={profile.cv} download>
                Descargar CV (PDF)
              </TextLink>
            </li>
          )}
        </ul>
        <div className="flex flex-col gap-1 text-sm text-text-muted sm:flex-row sm:justify-between">
          <p>
            Diseñado y construido por {profile.name}.
            {metaCaseHref && (
              <>
                {" "}
                <TextLink to={metaCaseHref}>Cómo hice este portafolio</TextLink>
              </>
            )}
          </p>
          <p>
            © {year} {profile.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
