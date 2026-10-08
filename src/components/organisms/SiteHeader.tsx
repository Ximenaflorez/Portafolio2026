import { useLocation } from "react-router";
import { useActiveSection, useAnchorScrollBehavior } from "~/lib/use-active-section";
import { TextLink } from "../atoms/TextLink";
import { SiteNav } from "../molecules/SiteNav";

// Fijo (FR-028). En teléfono el nombre sale con el scroll y solo queda la fila del menú:
// `top-header-collapse` oculta la fila del nombre; desde `sm` queda completo.
export function SiteHeader({ name }: { name: string }) {
  const { pathname } = useLocation();
  const current = useActiveSection(pathname === "/");
  useAnchorScrollBehavior();

  return (
    <header className="sticky top-header-collapse z-10 border-b border-border bg-background sm:top-0">
      <div className="mx-auto flex max-w-content flex-col px-3 sm:flex-row sm:items-center sm:justify-between md:px-4">
        <div className="pt-1 sm:py-1">
          <TextLink to="/#inicio" variant="standalone" className="font-heading text-lg font-bold">
            {name}
          </TextLink>
        </div>
        <div className="py-1">
          <SiteNav label="Principal" current={current} />
        </div>
      </div>
    </header>
  );
}
