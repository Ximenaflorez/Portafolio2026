import { TextLink } from "../atoms/TextLink";

type Props = {
  to: string;
  title: string;
  /** Tipo de producto, o la etiqueta de la tarjeta destacada. */
  eyebrow: string;
  role?: string;
  /** Línea de resultado del caso, o su descripción en la tarjeta destacada. */
  description: string;
  readLabel: string;
  /** Tarjeta aparte del caso meta, con el borde más marcado. */
  featured?: boolean;
};

// Es un `<li>` en la lista de casos y un `<div>` cuando va destacada fuera de la lista.
export function CaseCard({ to, title, eyebrow, role, description, readLabel, featured }: Props) {
  const Tag = featured ? "div" : "li";
  const border = featured ? "border-border-strong" : "border-border";
  return (
    <Tag className={`flex flex-col border ${border} bg-surface p-4`}>
      <p className="text-sm text-text-muted">{eyebrow}</p>
      <h3 className="mt-0.5 text-xl">{title}</h3>
      {role && <p className="mt-1 text-sm text-text-muted">{role}</p>}
      <p className="mt-2 flex-1">{description}</p>
      <div className="mt-2">
        <TextLink to={to} variant="standalone" className="font-semibold">
          {readLabel}
          <span className="sr-only">: {title}</span>
        </TextLink>
      </div>
    </Tag>
  );
}
