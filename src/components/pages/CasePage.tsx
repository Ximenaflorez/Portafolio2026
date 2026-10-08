import type { CaseStudy } from "~/content/schema";
import { extractSections } from "~/lib/case-sections";
import { CaseSummary, type CaseSummaryLabels } from "../molecules/CaseSummary";
import { SectionIndex } from "../molecules/SectionIndex";
import { CaseBody } from "../organisms/CaseBody";
import { CaseTemplate } from "../templates/CaseTemplate";
import { SiteTemplate } from "../templates/SiteTemplate";

export type CasePageLabels = {
  back: string;
  eyebrowProduct: string;
  eyebrowMeta: string;
  index: string;
  summary: CaseSummaryLabels;
};

type SiteProps = Parameters<typeof SiteTemplate>[0];

type Props = Pick<SiteProps, "profile" | "cvAvailable" | "metaCaseHref" | "year"> & {
  caseStudy: CaseStudy;
  labels: CasePageLabels;
  /** Ruta de la página principal del idioma: `/` o `/en/`. */
  homePath?: string;
};

export function CasePage({
  profile,
  cvAvailable,
  metaCaseHref,
  year,
  caseStudy,
  labels,
  homePath = "/",
}: Props) {
  const { type, title, summary, body } = caseStudy;
  const eyebrow =
    type === "meta"
      ? labels.eyebrowMeta
      : [labels.eyebrowProduct, summary.productType].filter(Boolean).join(" · ");

  return (
    <SiteTemplate
      profile={profile}
      cvAvailable={cvAvailable}
      metaCaseHref={metaCaseHref}
      year={year}
    >
      <CaseTemplate
        backHref={`${homePath}#trabajos`}
        backLabel={labels.back}
        eyebrow={eyebrow}
        title={title}
        summary={<CaseSummary summary={summary} labels={labels.summary} />}
        index={<SectionIndex label={labels.index} items={extractSections(body)} />}
      >
        <CaseBody markdown={body} />
      </CaseTemplate>
    </SiteTemplate>
  );
}
