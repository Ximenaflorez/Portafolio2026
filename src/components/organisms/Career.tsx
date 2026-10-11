import type { Career as CareerData } from "~/content/schema";
import { useUi } from "~/lib/use-ui";
import { Heading } from "../atoms/Heading";
import { CareerEntry } from "../molecules/CareerEntry";

const groups = ["experience", "education", "certificates"] as const;

export function Career({ career }: { career?: CareerData }) {
  const { t } = useUi();
  const titles = {
    experience: t("career.experience"),
    education: t("career.education"),
    certificates: t("career.certificates"),
  };
  const visible = groups
    .map((id) => ({
      id,
      title: titles[id],
      items: career?.[id] ?? [],
    }))
    .filter((group) => group.items.length > 0);

  if (visible.length === 0) return null;

  return (
    <div className="mt-8">
      <Heading level={3}>{t("career.title")}</Heading>
      {visible.map((group) => (
        <div key={group.id} className="mt-6">
          <Heading level={4} id={`titulo-carrera-${group.id}`}>
            {group.title}
          </Heading>
          <ul aria-labelledby={`titulo-carrera-${group.id}`}>
            {group.items.map((entry) => (
              <CareerEntry
                key={`${group.id}-${entry.title}-${entry.from}`}
                entry={entry}
                kind={group.id}
                presentLabel={t("career.present")}
                toolsLabel={t("career.tools", { title: entry.title })}
                credentialLabel={t("career.credential", { title: entry.title })}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
