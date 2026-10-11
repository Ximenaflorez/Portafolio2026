import { sectionPath } from "~/lib/i18n";
import { sections, type SectionId } from "~/lib/sections";
import { useUi } from "~/lib/use-ui";
import { NavLink } from "../atoms/NavLink";

// Navegación entre las secciones de la página principal del idioma. Solo vive en el encabezado:
// el pie no la repite.
export function SiteNav({ current, className }: { current?: SectionId; className?: string }) {
  const { language, t } = useUi();

  return (
    <nav aria-label={t("nav.label")} className={className}>
      <ul className="flex flex-wrap gap-x-2">
        {sections.map((section) => (
          <li key={section.id}>
            <NavLink to={sectionPath(language, section.id)} current={section.id === current}>
              {t(`nav.${section.id}`)}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
