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
      {visible.map((group) => (
        <div key={group.id} className="mt-6">
          <Heading level={3} id={`titulo-carrera-${group.id}`}>
            {group.title}
          </Heading>
          <ul
            aria-labelledby={`titulo-carrera-${group.id}`}
            className={
              group.id === "experience"
                ? "mt-2 divide-y divide-border border-y border-border"
                : "mt-2 grid gap-2 sm:grid-cols-2"
            }
          >
            {group.items.map((entry, index) => (
              <CareerEntry
                key={`${group.id}-${entry.title}-${entry.from}`}
                entry={entry}
                kind={group.id}
                presentLabel={t("career.present")}
                currentLabel={t("career.current")}
                toolsLabel={t("career.tools", { title: entry.title })}
                skillsLabel={t("career.skills", { title: entry.title })}
                skillsMoreLabel={(count) => t("career.skillsMore", { count })}
                credentialLabel={t("career.credential", { title: entry.title })}
                defaultOpen={group.id === "experience" && index === 0}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
