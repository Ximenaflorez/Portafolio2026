import { useLocation } from "react-router";
import { sectionPath } from "~/lib/i18n";
import { sections, type SectionId } from "~/lib/sections";
import { useUi } from "~/lib/use-ui";
import { NavLink } from "../atoms/NavLink";

// Navegación entre las secciones de la página principal del idioma. Solo vive en el encabezado:
// el pie no la repite. Los casos se abren desde el índice de Trabajos, no desde aquí.
export function SiteNav({
  current,
  className,
  id,
}: {
  current?: SectionId;
  className?: string;
  id?: string;
}) {
  const { language, t } = useUi();
  const { pathname } = useLocation();
  const onCase = /\/trabajos\/|\/work\//.test(pathname);

  return (
    <nav id={id} aria-label={t("nav.label")} className={className}>
      <ul className="flex flex-col gap-x-2 sm:flex-row sm:flex-wrap">
        {sections.map((section) => (
          <li key={section.id}>
            <NavLink
              to={sectionPath(language, section.id)}
              current={section.id === current || (section.id === "trabajos" && onCase)}
            >
              {t(`nav.${section.id}`)}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
