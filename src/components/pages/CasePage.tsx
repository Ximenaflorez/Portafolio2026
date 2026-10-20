import type { CaseStudy } from "~/content/schema";
import { homePath as languageHome } from "~/lib/i18n";
import { caseLabels } from "~/lib/ui";
import { useUi } from "~/lib/use-ui";
import { CaseSummary, type CaseSummaryLabels } from "../molecules/CaseSummary";
import { CaseBody } from "../organisms/CaseBody";
import { CaseTemplate } from "../templates/CaseTemplate";
import { SiteTemplate } from "../templates/SiteTemplate";

export type CasePageLabels = {
  back: string;
  eyebrowProduct: string;
  eyebrowMeta: string;
  summary: CaseSummaryLabels;
};

type SiteProps = Parameters<typeof SiteTemplate>[0];

type Props = Pick<
  SiteProps,
  "profile" | "cvAvailable" | "metaCaseHref" | "year" | "casePairs"
> & {
  caseStudy: CaseStudy;
  /** Textos de la página; por defecto, los de interfaz del idioma de la ruta. */
  labels?: CasePageLabels;
  /** Ruta de la página principal del idioma: `/` o `/en/`; por defecto, la del idioma de la ruta. */
  homePath?: string;
};

export function CasePage({
  profile,
  cvAvailable,
  metaCaseHref,
  year,
  casePairs,
  caseStudy,
  labels,
  homePath,
}: Props) {
  const { language, t } = useUi();
  const text = labels ?? caseLabels(t);
  const home = homePath ?? languageHome(language);
  const { type, title, summary, body } = caseStudy;
  const eyebrow =
    type === "meta"
      ? text.eyebrowMeta
      : [text.eyebrowProduct, summary.productType].filter(Boolean).join(" · ");

  return (
    <SiteTemplate
      profile={profile}
      cvAvailable={cvAvailable}
      metaCaseHref={metaCaseHref}
      year={year}
      casePairs={casePairs}
    >
      <CaseTemplate
        backHref={`${home}#trabajos`}
        backLabel={text.back}
        eyebrow={eyebrow}
        title={title}
        summary={<CaseSummary summary={summary} labels={text.summary} />}
      >
        <CaseBody markdown={body} />
      </CaseTemplate>
    </SiteTemplate>
  );
}
