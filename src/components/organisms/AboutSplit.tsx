import { ChartColumn, FileText, LayoutGrid, Search, type LucideIcon } from "lucide-react";
import { Heading } from "../atoms/Heading";
import { Text } from "../atoms/Text";

type Practice = {
  title: string;
  body: string;
  icon: "research" | "systems" | "data" | "spec";
};

type Props = {
  headingId: string;
  index: string;
  heading: string;
  intro: string;
  practices: Practice[];
};

const practiceIcons: Record<Practice["icon"], LucideIcon> = {
  research: Search,
  systems: LayoutGrid,
  data: ChartColumn,
  spec: FileText,
};

function PracticeIcon({ name }: { name: Practice["icon"] }) {
  const Icon = practiceIcons[name];
  return <Icon aria-hidden focusable="false" className="h-4 w-4 text-primary" />;
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
      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {practices.map((item) => (
          <li key={item.title} className="card-flat rounded-card bg-surface p-6">
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
