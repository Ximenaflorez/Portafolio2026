import type { CareerCertificate, CareerEducation, CareerExperience } from "~/content/schema";
import type { Language } from "~/lib/i18n";
import { useUi } from "~/lib/use-ui";
import { TextLink } from "../atoms/TextLink";

const months = {
  es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
} as const;

function formatDate(value: string | number | Date, language: Language): string {
  const text =
    value instanceof Date
      ? `${value.getUTCFullYear()}-${String(value.getUTCMonth() + 1).padStart(2, "0")}`
      : String(value);
  const [year, month] = text.split("-");
  if (!month) return year;
  return `${months[language][Number(month) - 1]} ${year}`;
}

type Entry = CareerExperience | CareerEducation | CareerCertificate;

type Props = {
  entry: Entry;
  kind: "experience" | "education" | "certificates";
  presentLabel: string;
  toolsLabel: string;
  credentialLabel: string;
};

export function CareerEntry({ entry, kind, presentLabel, toolsLabel, credentialLabel }: Props) {
  const { language } = useUi();
  const showRange = kind === "experience";
  const to = "to" in entry ? entry.to : undefined;
  const tools = "tools" in entry ? entry.tools : undefined;
  const summary = "summary" in entry ? entry.summary : undefined;
  const credentialUrl = "credentialUrl" in entry ? entry.credentialUrl : undefined;

  return (
    <li className="mt-4">
      <p className="font-semibold">{entry.title}</p>
      <p className="text-text-muted">{entry.organization}</p>
      <p className="mt-0.5 text-sm text-text-muted">
        <time dateTime={entry.from}>{formatDate(entry.from, language)}</time>
        {showRange && (
          <>
            {" – "}
            {to ? <time dateTime={to}>{formatDate(to, language)}</time> : presentLabel}
          </>
        )}
      </p>
      {summary && <p className="mt-1 max-w-prose">{summary}</p>}
      {tools && tools.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-1" aria-label={toolsLabel}>
          {tools.map((tool) => (
            <li
              key={tool}
              className="rounded-chip border border-border bg-surface-tonal px-1 py-0.5 text-sm"
            >
              {tool}
            </li>
          ))}
        </ul>
      )}
      {credentialUrl && (
        <TextLink variant="standalone" href={credentialUrl}>
          {credentialLabel}
        </TextLink>
      )}
    </li>
  );
}
