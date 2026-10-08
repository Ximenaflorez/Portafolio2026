import { CaseCard } from "../molecules/CaseCard";

type CardProps = Parameters<typeof CaseCard>[0];

// Tres tarjetas en fila en escritorio y el caso meta como tarjeta aparte y destacada (FR-019).
export function CaseIndex({
  cases,
  featured,
}: {
  cases: Omit<CardProps, "featured">[];
  featured?: Omit<CardProps, "featured">;
}) {
  return (
    <>
      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {cases.map((item) => (
          <CaseCard key={item.to} {...item} />
        ))}
      </ul>
      {featured && (
        <div className="mt-4">
          <CaseCard {...featured} featured />
        </div>
      )}
    </>
  );
}
