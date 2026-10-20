import { CaseCard } from "../molecules/CaseCard";

type CardProps = Parameters<typeof CaseCard>[0];

// Cada tarjeta ocupa el ancho de la sección: texto a la izquierda, imagen a la derecha.
// El caso de este portafolio es una tarjeta más, el cuarto proyecto.
export function CaseIndex({ cases, emptyLabel }: { cases: CardProps[]; emptyLabel: string }) {
  if (cases.length === 0) {
    return <p className="mt-6 max-w-prose">{emptyLabel}</p>;
  }

  return (
    <ul className="mt-6 flex flex-col gap-4">
      {cases.map((item) => (
        <CaseCard key={item.to} {...item} />
      ))}
    </ul>
  );
}
