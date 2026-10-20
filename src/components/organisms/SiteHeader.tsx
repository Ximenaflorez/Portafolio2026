import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useLocation } from "react-router";
import {
  equivalentPath,
  isHomePath,
  otherLanguage,
  sectionPath,
  type CasePair,
} from "~/lib/i18n";
import { useActiveSection, useAnchorScrollBehavior } from "~/lib/use-active-section";
import { useVisibleHeaderOffset } from "~/lib/use-header-offset";
import { useUi } from "~/lib/use-ui";
import { LanguageSwitch } from "../atoms/LanguageSwitch";
import { MenuToggle } from "../atoms/MenuToggle";
import { TextLink } from "../atoms/TextLink";
import { ThemeToggle } from "../atoms/ThemeToggle";
import { SiteNav } from "../molecules/SiteNav";

const noop = () => () => {};
const menuId = "menu-principal";

// Fijo (FR-028, FR-043). En teléfono: nombre a la izquierda; idioma, tema y hamburguesa a la
// derecha; el menú se abre debajo. Desde `sm` la nav queda a la derecha y, al final, idioma y tema.
export function SiteHeader({
  name,
  casePairs = [],
}: {
  name: string;
  casePairs?: CasePair[];
}) {
  const headerRef = useRef<HTMLElement>(null);
  const { pathname, hash } = useLocation();
  const { language, t } = useUi();
  const isHome = isHomePath(pathname);
  const current = useActiveSection(isHome);
  useAnchorScrollBehavior();
  useVisibleHeaderOffset(headerRef);

  const hydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname, hash]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const target = otherLanguage(language);
  // En la página principal el selector conserva la sección que se está viendo; en Inicio, que es
  // el comienzo de la página, no hace falta ancla.
  const kept = isHome && current !== "inicio" ? current : undefined;
  const languageHref = equivalentPath(pathname, target, casePairs, kept);

  return (
    <header ref={headerRef} className="sticky top-0 z-10 header-glass border-b border-border">
      <div className="mx-auto flex max-w-content flex-wrap items-center px-3 sm:flex-nowrap sm:gap-x-3 md:px-4">
        <div className="py-1 sm:order-1">
          <TextLink
            to={sectionPath(language, "inicio")}
            variant="standalone"
            className="font-heading text-lg font-bold"
          >
            {name}
          </TextLink>
        </div>
        <div className="ml-auto flex items-center py-1 sm:order-3 sm:ml-0">
          <LanguageSwitch
            to={languageHref}
            code={t("controls.languageCode")}
            name={t("controls.languageName")}
            language={target}
          />
          <ThemeToggle label={t("controls.theme")} />
          {hydrated ? (
            <MenuToggle
              open={open}
              openLabel={t("nav.open")}
              closeLabel={t("nav.close")}
              controls={menuId}
              onClick={() => setOpen((value) => !value)}
            />
          ) : null}
        </div>
        <SiteNav
          id={menuId}
          current={current}
          className={`w-full py-1 sm:order-2 sm:ml-auto sm:w-auto ${hydrated && !open ? "max-sm:hidden" : ""}`}
        />
      </div>
    </header>
  );
}
