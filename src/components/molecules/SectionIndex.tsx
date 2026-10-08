import type { CaseSection } from "~/lib/case-sections";
import { TextLink } from "../atoms/TextLink";

// Índice de las secciones de un caso: enlaces ancla que funcionan sin JavaScript (FR-035).
export function SectionIndex({ label, items }: { label: string; items: CaseSection[] }) {
  return (
    <nav aria-label={label} className="mt-6">
      <p className="font-semibold">{label}</p>
      <ol className="mt-1 flex flex-wrap gap-x-3">
        {items.map((item) => (
          <li key={item.id}>
            <TextLink href={`#${item.id}`} variant="standalone">
              {item.number}. {item.title}
            </TextLink>
          </li>
        ))}
      </ol>
    </nav>
  );
}
