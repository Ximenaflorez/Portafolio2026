import { useRef, useState } from "react";
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
  currentLabel: string;
  toolsLabel: string;
  skillsLabel: string;
  skillsMoreLabel: (count: number) => string;
  credentialLabel: string;
  /** Solo experiencia: el primer puesto arranca abierto. */
  defaultOpen?: boolean;
};

function Dates({
  from,
  to,
  presentLabel,
  language,
  className,
}: {
  from: string | number | Date;
  to?: string | number | Date;
  presentLabel: string;
  language: Language;
  className?: string;
}) {
  return (
    <p className={className}>
      <time dateTime={String(from)}>{formatDate(from, language)}</time>
      {" – "}
      {to ? <time dateTime={String(to)}>{formatDate(to, language)}</time> : presentLabel}
    </p>
  );
}

function Summary({ text }: { text: string }) {
  const lines = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  return (
    <div className="space-y-2">
      {lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  );
}

const chip = "rounded-chip border border-border bg-surface px-1 py-0.5 text-sm";
const visibleSkills = 5;

function Skills({
  skills,
  label,
  moreLabel,
}: {
  skills: string[];
  label: string;
  moreLabel: (count: number) => string;
}) {
  const [open, setOpen] = useState(false);
  const hidden = Math.max(skills.length - visibleSkills, 0);
  const shown = open || hidden === 0 ? skills : skills.slice(0, visibleSkills);

  return (
    <ul className="mt-2 flex flex-wrap items-center gap-1" aria-label={label}>
      {shown.map((skill) => (
        <li key={skill} className={chip}>
          {skill}
        </li>
      ))}
      {!open && hidden > 0 ? (
        <li>
          <button
            type="button"
            className={`${chip} inline-flex min-h-target min-w-target items-center justify-center`}
            aria-expanded="false"
            aria-label={moreLabel(hidden)}
            onClick={() => setOpen(true)}
          >
            +{hidden}
          </button>
        </li>
      ) : null}
    </ul>
  );
}

function Tools({ tools, label }: { tools: string[]; label: string }) {
  return (
    <ul className="mt-2 flex flex-wrap gap-1" aria-label={label}>
      {tools.map((tool) => (
        <li key={tool} className={chip}>
          {tool}
        </li>
      ))}
    </ul>
  );
}

function ToggleIcon() {
  return (
    <span className="inline-flex min-h-target min-w-target shrink-0 items-center justify-center text-text">
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="h-3 w-3 group-open:hidden"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="hidden h-3 w-3 group-open:block"
      >
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </span>
  );
}

export function CareerEntry({
  entry,
  kind,
  presentLabel,
  currentLabel,
  toolsLabel,
  skillsLabel,
  skillsMoreLabel,
  credentialLabel,
  defaultOpen = false,
}: Props) {
  const { language } = useUi();
  const opened = useRef(false);
  const to = "to" in entry ? entry.to : undefined;
  const tools = "tools" in entry ? entry.tools : undefined;
  const skills = "skills" in entry ? entry.skills : undefined;
  const summary = "summary" in entry ? entry.summary : undefined;
  const credentialUrl = "credentialUrl" in entry ? entry.credentialUrl : undefined;
  const current = kind === "experience" && !to;

  if (kind !== "experience") {
    return (
      <li className="flex flex-col rounded-card border border-border bg-surface-tonal p-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
          <div>
            <p className="font-semibold">{entry.title}</p>
            <p className="text-text-muted">{entry.organization}</p>
          </div>
          <p className="text-sm text-text-muted sm:text-right">
            <time dateTime={String(entry.from)}>{formatDate(entry.from, language)}</time>
          </p>
        </div>
        {credentialUrl && (
          <div className="mt-2">
            <TextLink variant="standalone" href={credentialUrl}>
              {credentialLabel}
            </TextLink>
          </div>
        )}
      </li>
    );
  }

  return (
    <li>
      <details
        className="group"
        ref={(el) => {
          if (el && defaultOpen && !opened.current) {
            el.open = true;
            opened.current = true;
          }
        }}
      >
        <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-2 gap-y-1 py-4 [&::-webkit-details-marker]:hidden">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-2">
            <p className="font-semibold">{entry.title}</p>
            <p className="text-text-muted">
              {entry.organization}
              {current ? (
                <span className="ml-2 inline-flex items-center gap-1 text-sm">
                  <span className="size-1 rounded-full bg-success" aria-hidden="true" />
                  {currentLabel}
                </span>
              ) : null}
            </p>
          </div>
          <Dates
            from={entry.from}
            to={to}
            presentLabel={presentLabel}
            language={language}
            className="ml-auto text-sm text-text-muted"
          />
          <ToggleIcon />
        </summary>
        <div className="pb-4">
          {summary ? <Summary text={summary} /> : null}
          {skills && skills.length > 0 ? (
            <Skills skills={skills} label={skillsLabel} moreLabel={skillsMoreLabel} />
          ) : null}
          {tools && tools.length > 0 ? <Tools tools={tools} label={toolsLabel} /> : null}
        </div>
      </details>
    </li>
  );
}
