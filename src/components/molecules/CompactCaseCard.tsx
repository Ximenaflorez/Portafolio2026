import { ArrowUpRight } from "lucide-react";
import { TextLink } from "../atoms/TextLink";

type Props = {
  to: string;
  title: string;
  description: string;
  tags: string[];
  readLabel: string;
};

const chip = "self-start rounded-chip border border-border bg-surface px-1 py-0.5 text-sm";

// Grilla de Trabajos: sin foto ni resultado extendido. El enlace abre el caso.
export function CompactCaseCard({ to, title, description, tags, readLabel }: Props) {
  return (
    <li className="flex flex-col rounded-card border border-border bg-surface p-3">
      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <p key={tag} className={chip}>
              {tag}
            </p>
          ))}
        </div>
      ) : null}
      <h3 className="mt-2 text-lg">{title}</h3>
      <p className="mt-2 text-sm">{description}</p>
      <TextLink to={to} variant="standalone" className="mt-auto gap-1 pt-3 font-semibold">
        {readLabel}
        <ArrowUpRight aria-hidden focusable="false" className="ui-icon" />
        <span className="sr-only">: {title}</span>
      </TextLink>
    </li>
  );
}
