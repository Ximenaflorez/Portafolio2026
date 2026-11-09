import { Link } from "react-router";

type Props = {
  to: string;
  title: string;
  description: string;
  tags: string[];
};

const chip = "self-start rounded-chip border border-border bg-surface px-1 py-0.5 text-sm";

// Grilla de Trabajos: sin foto ni resultado extendido. El enlace abre el caso.
export function CompactCaseCard({ to, title, description, tags }: Props) {
  return (
    <li className="card-lift flex flex-col rounded-card bg-surface p-6">
      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <p key={tag} className={chip}>
              {tag}
            </p>
          ))}
        </div>
      ) : null}
      <h3 className="mt-2 text-lg">
        <Link to={to} className="card-hit">
          {title}
        </Link>
      </h3>
      <p className="mt-2 text-sm">{description}</p>
    </li>
  );
}
