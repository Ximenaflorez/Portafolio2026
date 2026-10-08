import { useLocation } from "react-router";
import { equivalentPath, isHomePath, otherLanguage, sectionPath, type CasePair } from "~/lib/i18n";
import { useActiveSection, useAnchorScrollBehavior } from "~/lib/use-active-section";
import { useUi } from "~/lib/use-ui";
import { LanguageSwitch } from "../atoms/LanguageSwitch";
import { TextLink } from "../atoms/TextLink";
import { ThemeToggle } from "../atoms/ThemeToggle";
import { SiteNav } from "../molecules/SiteNav";

// Fijo (FR-028, FR-043). En teléfono el nombre sale con el scroll y solo queda la fila del menú,
// que lleva dos líneas: la navegación y, debajo, el selector de idioma y el botón de tema.
// `top-header-collapse` oculta la fila del nombre; desde `sm` todo va en una sola fila.
export function SiteHeader({ name, casePairs = [] }: { name: string; casePairs?: CasePair[] }) {
  const { pathname } = useLocation();
  const { language, t } = useUi();
  const isHome = isHomePath(pathname);
  const current = useActiveSection(isHome);
  useAnchorScrollBehavior();

  const target = otherLanguage(language);
  // En la página principal el selector conserva la sección que se está viendo; en Inicio, que es
  // el comienzo de la página, no hace falta ancla.
  const kept = isHome && current !== "inicio" ? current : undefined;
  const languageHref = equivalentPath(pathname, target, casePairs, kept);

  return (
    <header className="sticky top-header-collapse z-10 border-b border-border bg-background sm:top-0">
      <div className="mx-auto flex max-w-content flex-col px-3 sm:flex-row sm:items-center sm:justify-between md:px-4">
        <div className="pt-1 sm:py-1">
          <TextLink
            to={sectionPath(language, "inicio")}
            variant="standalone"
            className="font-heading text-lg font-bold"
          >
            {name}
          </TextLink>
        </div>
        <div className="flex flex-wrap items-center gap-x-2 py-1 sm:flex-nowrap sm:gap-x-3">
          <SiteNav current={current} />
          <div className="flex w-full items-center justify-end sm:w-auto">
            <LanguageSwitch
              to={languageHref}
              code={t("controls.languageCode")}
              name={t("controls.languageName")}
              language={target}
            />
            <ThemeToggle label={t("controls.theme")} />
          </div>
        </div>
      </div>
    </header>
  );
}
