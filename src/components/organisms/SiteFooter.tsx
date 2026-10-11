import type { Profile } from "~/content/schema";
import { useUi } from "~/lib/use-ui";
import { TextLink } from "../atoms/TextLink";
import { ContactList } from "../molecules/ContactList";

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
  const { t } = useUi();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-content flex-col gap-4 px-3 py-6 md:px-4">
        <ContactList
          email={profile.email}
          linkedin={profile.linkedin}
          cv={cvAvailable ? profile.cv : undefined}
          label={t("footer.contact")}
          cvLabel={t("footer.cv")}
          className="flex flex-wrap gap-x-3"
        />
        <div className="flex flex-col gap-1 text-sm text-text-muted sm:flex-row sm:justify-between">
          <p>
            {t("footer.credit", { name: profile.name })}
            {metaCaseHref && (
              <>
                {" "}
                <TextLink to={metaCaseHref}>{t("footer.metaCase")}</TextLink>
              </>
            )}
          </p>
          <p>{t("footer.rights", { year, name: profile.name })}</p>
        </div>
      </div>
    </footer>
  );
}
