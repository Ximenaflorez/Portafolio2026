import { CasePage } from "~/components/pages/CasePage";
import type { CasePair } from "~/lib/i18n";
import type { CaseStudy, Profile } from "~/content/schema";

// Vista compartida por las cuatro rutas de caso (español e inglés, producto y meta): el idioma
// lo da la ruta, así que la página no necesita saber en cuál está.
export type CaseRouteData = {
  case: CaseStudy;
  profile: Profile;
  cvAvailable: boolean;
  casePairs: CasePair[];
  metaCaseHref?: string;
};

export function CaseRouteView({ data }: { data: CaseRouteData }) {
  return (
    <CasePage
      profile={data.profile}
      cvAvailable={data.cvAvailable}
      metaCaseHref={data.metaCaseHref}
      casePairs={data.casePairs}
      caseStudy={data.case}
    />
  );
}
