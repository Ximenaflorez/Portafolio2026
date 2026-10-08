import { sections, type SectionId } from "~/lib/sections";
import { NavLink } from "../atoms/NavLink";

// Navegación entre las secciones de `/`. Solo vive en el encabezado: el pie no la repite.
export function SiteNav({ label, current }: { label: string; current?: SectionId }) {
  return (
    <nav aria-label={label}>
      <ul className="flex flex-wrap gap-x-2">
        {sections.map((section) => (
          <li key={section.id}>
            <NavLink to={`/#${section.id}`} current={section.id === current}>
              {section.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
