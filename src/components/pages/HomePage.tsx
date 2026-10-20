import type { CaseStudy, Profile } from "~/content/schema";
import { splitAbout } from "~/lib/about";
import { firstMarkdownImage } from "~/lib/case-sections";
import { casePath, metaCasePath, sectionPath, type Language } from "~/lib/i18n";
import type { Translate } from "~/lib/ui";
import { useUi } from "~/lib/use-ui";
import { Text } from "../atoms/Text";
import { ContactList } from "../molecules/ContactList";
import { AboutSplit } from "../organisms/AboutSplit";
import { CaseIndex } from "../organisms/CaseIndex";
import { Career } from "../organisms/Career";
import { ProfileIntro } from "../organisms/ProfileIntro";
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
    tags: item.summary.tags,
    role: item.summary.role,
    description: (!isMeta && item.summary.indexLine) || item.summary.keyResult,
    readLabel: t("work.read"),
    image: firstMarkdownImage(item.body),
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
  const aboutParts = splitAbout(about);

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
            stats={[
              { value: t("home.stat.years.value"), label: t("home.stat.years.label") },
              { value: t("home.stat.cases.value"), label: t("home.stat.cases.label") },
              { value: t("home.stat.result.value"), label: t("home.stat.result.label") },
            ]}
          />
        }
        sections={[
          {
            id: "trabajos",
            title: t("home.trabajos.heading"),
            eyebrow: t("home.trabajos.index"),
            titleSize: "3xl",
            children: <CaseIndex cases={cards} emptyLabel={t("work.empty")} />,
          },
          {
            id: "sobre-mi",
            title: t("home.sobre-mi.heading"),
            hideTitle: true,
            children: (
              <>
                <AboutSplit
                  headingId="titulo-sobre-mi"
                  index={t("home.sobre-mi.index")}
                  heading={t("home.sobre-mi.heading")}
                  intro={aboutParts.working}
                  practices={[
                    {
                      title: t("home.sobre-mi.research.title"),
                      body: t("home.sobre-mi.research.body"),
                      icon: "research",
                    },
                    {
                      title: t("home.sobre-mi.systems.title"),
                      body: t("home.sobre-mi.systems.body"),
                      icon: "systems",
                    },
                    {
                      title: t("home.sobre-mi.data.title"),
                      body: t("home.sobre-mi.data.body"),
                      icon: "data",
                    },
                  ]}
                />
                <Career career={profile.career} />
              </>
            ),
          },
          {
            id: "contacto",
            title: t("home.contacto.heading"),
            eyebrow: t("home.contacto.index"),
            titleSize: "4xl",
            children: (
              <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <Text className="max-w-prose lg:max-w-sm">{contactCall.trim()}</Text>
                <ContactList
                  variant="actions"
                  email={profile.email}
                  emailLabel={t("home.contacto.email")}
                  linkedin={profile.linkedin}
                  cv={cvAvailable ? profile.cv : undefined}
                  label={t("footer.contact")}
                  cvLabel={t("home.contacto.cv")}
                  className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:shrink-0 lg:flex-nowrap"
                />
              </div>
            ),
          },
        ]}
      />
    </SiteTemplate>
  );
}
