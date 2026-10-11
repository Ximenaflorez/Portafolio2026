import { useLocation } from "react-router";
import { equivalentPath, isHomePath, otherLanguage, sectionPath, type CasePair } from "~/lib/i18n";
import { useActiveSection, useAnchorScrollBehavior } from "~/lib/use-active-section";
import { useUi } from "~/lib/use-ui";
import { LanguageSwitch } from "../atoms/LanguageSwitch";
import { TextLink } from "../atoms/TextLink";
import { ThemeToggle } from "../atoms/ThemeToggle";
import { SiteNav } from "../molecules/SiteNav";

// Fijo (FR-028, FR-043). En teléfono hay dos filas: nombre con idioma y tema a la derecha (se
// desplaza con la página) y, debajo, el menú (única fila fija). `top-header-collapse` oculta la
// primera fila; desde `sm` todo va en una sola fila. Las clases `order-*` colocan los controles
// junto al nombre en teléfono; en el documento el orden es siempre nombre, menú, idioma y tema.
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
    <header className="sticky top-header-collapse z-10 header-glass border-b border-border sm:top-0">
      <div className="mx-auto flex max-w-content flex-wrap items-center px-3 sm:flex-nowrap sm:gap-x-3 md:px-4">
        <div className="order-1 pt-1 sm:order-none sm:mr-auto sm:py-1">
          <TextLink
            to={sectionPath(language, "inicio")}
            variant="standalone"
            className="font-heading text-lg font-bold"
          >
            {name}
          </TextLink>
        </div>
        <SiteNav current={current} className="order-3 w-full py-1 sm:order-none sm:w-auto" />
        <div className="order-2 ml-auto flex items-center pt-1 sm:order-none sm:ml-0 sm:py-1">
          <LanguageSwitch
            to={languageHref}
            code={t("controls.languageCode")}
            name={t("controls.languageName")}
            language={target}
          />
          <ThemeToggle label={t("controls.theme")} />
        </div>
      </div>
    </header>
  );
}
