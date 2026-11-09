import type { CaseStudy, Profile } from "~/content/schema";
import { splitAbout } from "~/lib/about";
import { firstMarkdownImage } from "~/lib/case-sections";
import { casePath, metaCasePath, sectionPath, type Language } from "~/lib/i18n";
import type { Translate } from "~/lib/ui";
import { useUi } from "~/lib/use-ui";
import { Text } from "../atoms/Text";
import { Heading } from "../atoms/Heading";
import { CompactCaseCard } from "../molecules/CompactCaseCard";
import { CaseCard } from "../molecules/CaseCard";
import { ContactList } from "../molecules/ContactList";
import { AboutSplit } from "../organisms/AboutSplit";
import { Career } from "../organisms/Career";
import { ProfileIntro } from "../organisms/ProfileIntro";
import { ContentTemplate } from "../templates/ContentTemplate";
import { SiteTemplate } from "../templates/SiteTemplate";

type SiteProps = Parameters<typeof SiteTemplate>[0];

type Props = Pick<SiteProps, "metaCaseHref" | "year" | "casePairs"> & {
  cvAvailable: boolean;
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
    screen: item.summary.screenUrl
      ? { href: item.summary.screenUrl, label: t("work.screen") }
      : undefined,
    spec: item.summary.specUrl
      ? { href: item.summary.specUrl, label: t("work.spec") }
      : undefined,
    image: firstMarkdownImage(item.body),
  };
}

function compactCard(item: CaseStudy, language: Language, t: Translate) {
  const isMeta = item.type === "meta";
  const tags =
    (!isMeta && item.summary.cardTags) ||
    [item.summary.sector, ...(item.summary.tags ?? [])].filter((tag): tag is string => Boolean(tag));
  return {
    to: isMeta ? metaCasePath(language) : casePath(language, item.slug),
    title: (!isMeta && item.summary.cardTitle) || item.title,
    description:
      (!isMeta && item.summary.cardLine) || (!isMeta && item.summary.indexLine) || item.summary.keyResult,
    tags,
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
  const published = [...cases, ...(meta ? [meta] : [])];
  const featured = published
    .filter((item) => item.type === "product" && item.featured)
    .map((item) => caseCard(item, language, t));
  const compact = published
    .filter((item) => !(item.type === "product" && item.featured))
    .map((item) => compactCard(item, language, t));
  const aboutParts = splitAbout(about);

  return (
    <SiteTemplate profile={profile} metaCaseHref={metaCaseHref} year={year} casePairs={casePairs}>
      <ContentTemplate
        intro={
          <ProfileIntro
            title={[t("home.hero.line1"), t("home.hero.line2"), t("home.hero.line3")]}
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
            children: (
              <>
                {featured.length === 0 && compact.length === 0 ? (
                  <p className="mt-6 max-w-prose">{t("work.empty")}</p>
                ) : null}
                {featured.length > 0 ? (
                  <div className="mt-6">
                    <Heading level={3} size="xl">
                      {t("home.trabajos.featured")}
                    </Heading>
                    <ul className="mt-4 flex flex-col gap-4">
                      {featured.map((item) => (
                        <CaseCard key={item.to} {...item} />
                      ))}
                    </ul>
                  </div>
                ) : null}
                {compact.length > 0 ? (
                  <div className="mt-8">
                    <Heading level={3} size="lg">
                      {t("home.trabajos.more")}
                    </Heading>
                    <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {compact.map((item) => (
                        <CompactCaseCard key={item.to} {...item} />
                      ))}
                    </ul>
                  </div>
                ) : null}
              </>
            ),
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
                    {
                      title: t("home.sobre-mi.spec.title"),
                      body: t("home.sobre-mi.spec.body"),
                      icon: "spec",
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
