import type { CaseStudy, Profile } from "~/content/schema";
import { casePath, metaCasePath, sectionPath, type Language } from "~/lib/i18n";
import type { Translate } from "~/lib/ui";
import { useUi } from "~/lib/use-ui";
import { Text } from "../atoms/Text";
import { ContactList } from "../molecules/ContactList";
import { CaseIndex } from "../organisms/CaseIndex";
import { ProfileIntro } from "../organisms/ProfileIntro";
import { ProseBody } from "../organisms/ProseBody";
import { ContentTemplate } from "../templates/ContentTemplate";
import { SiteTemplate } from "../templates/SiteTemplate";

type SiteProps = Parameters<typeof SiteTemplate>[0];

type Props = Pick<SiteProps, "cvAvailable" | "metaCaseHref" | "year" | "casePairs"> & {
  profile: Profile;
  /** Casos de producto publicados, ya ordenados. */
  cases: CaseStudy[];
  /** Caso de este portafolio: la cuarta tarjeta, si está publicado. */
  meta: CaseStudy | null;
  /** Cuerpo de Sobre mí (Forma de trabajar y Métodos), en Markdown. */
  about: string;
  /** Llamado a contacto: el cuerpo de `inicio.md`. */
  contactCall: string;
};

const photoSrc = "/perfil.jpg";

function caseCard(item: CaseStudy, language: Language, t: Translate) {
  const isMeta = item.type === "meta";
  return {
    to: isMeta ? metaCasePath(language) : casePath(language, item.slug),
    title: item.title,
    sector: item.summary.sector ?? "",
    sectorLabel: t("work.sector"),
    role: item.summary.role,
    description: (!isMeta && item.summary.indexLine) || item.summary.keyResult,
    readLabel: t("work.read"),
  };
}

// Una sola página con Inicio, Trabajos, Sobre mí y Contacto (aprobada en T066).
export function HomePage({
  profile,
  cvAvailable,
  metaCaseHref,
  year,
  casePairs,
  cases,
  meta,
  about,
  contactCall,
}: Props) {
  const { language, t } = useUi();
  const cards = [...cases, ...(meta ? [meta] : [])].map((item) => caseCard(item, language, t));

  return (
    <SiteTemplate
      profile={profile}
      cvAvailable={cvAvailable}
      metaCaseHref={metaCaseHref}
      year={year}
      casePairs={casePairs}
    >
      <ContentTemplate
        intro={
          <ProfileIntro
            name={profile.name}
            role={profile.role}
            valueProposition={profile.valueProposition}
            email={profile.email}
            workHref={sectionPath(language, "trabajos")}
            headingId="titulo-inicio"
            photo={{ src: photoSrc, alt: t("home.photoAlt", { name: profile.name }) }}
            labels={{ work: t("home.ctaWork"), contact: t("home.ctaContact") }}
          />
        }
        sections={[
          { id: "trabajos", title: t("home.trabajos"), children: <CaseIndex cases={cards} /> },
          { id: "sobre-mi", title: t("home.sobre-mi"), children: <ProseBody markdown={about} /> },
          {
            id: "contacto",
            title: t("home.contacto"),
            children: (
              <>
                <Text className="mt-2 max-w-prose">{contactCall.trim()}</Text>
                <ContactList
                  email={profile.email}
                  linkedin={profile.linkedin}
                  cv={cvAvailable ? profile.cv : undefined}
                  label={t("footer.contact")}
                  cvLabel={t("footer.cv")}
                  className="mt-4 flex flex-col"
                />
              </>
            ),
          },
        ]}
      />
    </SiteTemplate>
  );
}
