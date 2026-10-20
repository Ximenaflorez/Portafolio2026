import { Heading } from "../atoms/Heading";
import { Text } from "../atoms/Text";

type Practice = {
  title: string;
  body: string;
  icon: "research" | "systems" | "data";
};

type Props = {
  headingId: string;
  index: string;
  heading: string;
  intro: string;
  practices: Practice[];
};

function PracticeIcon({ name }: { name: Practice["icon"] }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-primary"
    >
      {name === "research" ? (
        <>
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </>
      ) : null}
      {name === "systems" ? (
        <>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </>
      ) : null}
      {name === "data" ? (
        <>
          <path d="M4 19V11" />
          <path d="M10 19V5" />
          <path d="M16 19v-6" />
          <path d="M21 19H3" />
        </>
      ) : null}
    </svg>
  );
}

function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
        .map((paragraph) => (
          <Text key={paragraph} className="mt-4">
            {paragraph}
          </Text>
        ))}
    </>
  );
}

export function AboutSplit({ headingId, index, heading, intro, practices }: Props) {
  return (
    <div>
      <Text tone="muted" size="sm">
        {index}
      </Text>
      <Heading level={2} size="3xl" id={headingId} className="mt-2 whitespace-pre-line">
        {heading}
      </Heading>
      <Paragraphs text={intro} />
      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {practices.map((item) => (
          <li key={item.title} className="rounded-card border border-border bg-surface p-6">
            <PracticeIcon name={item.icon} />
            <Heading level={3} size="lg" className="mt-2">
              {item.title}
            </Heading>
            <Text tone="muted" className="mt-2">
              {item.body}
            </Text>
          </li>
        ))}
      </ul>
    </div>
  );
}
