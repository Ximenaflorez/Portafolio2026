import { CaseCard } from "../molecules/CaseCard";

type CardProps = Parameters<typeof CaseCard>[0];

// Las tarjetas de los casos en dos columnas desde `sm` (FR-019). El caso de este portafolio es una
// tarjeta más, el cuarto proyecto: quien llama lo pone en la lista como cualquier otro.
export function CaseIndex({ cases }: { cases: CardProps[] }) {
  return (
    <ul className="mt-6 grid gap-4 sm:grid-cols-2">
      {cases.map((item) => (
        <CaseCard key={item.to} {...item} />
      ))}
    </ul>
  );
}
