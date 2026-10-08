import type { ReactNode } from "react";
import { SkipLink } from "../atoms/SkipLink";
import { SiteFooter } from "../organisms/SiteFooter";
import { SiteHeader } from "../organisms/SiteHeader";

type FooterProps = Parameters<typeof SiteFooter>[0];

// Elementos globales en el orden de tabulación de contracts/routes.md.
export function SiteTemplate({
  profile,
  cvAvailable,
  metaCaseHref,
  year,
  children,
}: FooterProps & { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SkipLink />
      <SiteHeader name={profile.name} />
      <main
        id="contenido"
        tabIndex={-1}
        className="mx-auto w-full max-w-content flex-1 px-3 focus:outline-none md:px-4"
      >
        {children}
      </main>
      <SiteFooter
        profile={profile}
        cvAvailable={cvAvailable}
        metaCaseHref={metaCaseHref}
        year={year}
      />
    </div>
  );
}
