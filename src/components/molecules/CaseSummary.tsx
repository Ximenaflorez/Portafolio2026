import type { ReactNode } from "react";
import type { CaseSummary as Summary } from "~/content/schema";
import { Figure } from "../atoms/Figure";
import { Heading } from "../atoms/Heading";

export type CaseSummaryLabels = {
  title: string;
  product: string;
  role: string;
  team: string;
  duration: string;
  keyResult: string;
  kind: string;
};

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-sm uppercase text-text-muted">{label}</dt>
      <dd className="mt-1">{children}</dd>
    </div>
  );
}

// El producto abre el caso; rol, equipo, duración y tipo van en fila. El resultado clave
// ocupa todo el ancho (FR-020, FR-035).
export function CaseSummary({
  summary,
  labels,
  image,
}: {
  summary: Pick<Summary, "product" | "role" | "team" | "duration" | "keyResult" | "kind">;
  labels: CaseSummaryLabels;
  /** Primera imagen del caso, justo bajo la frase de producto. */
  image?: { src: string; alt: string; caption: string };
}) {
  return (
    <>
      <Heading level={2} size="xl" className="sr-only">
        {labels.title}
      </Heading>
      <p className="mt-4 max-w-prose text-lg">{summary.product}</p>
      {image ? <Figure src={image.src} alt={image.alt} caption={image.caption} /> : null}
      <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-4 lg:grid-cols-4">
        <Field label={labels.role}>{summary.role}</Field>
        {summary.team && <Field label={labels.team}>{summary.team}</Field>}
        <Field label={labels.duration}>{summary.duration}</Field>
        {summary.kind && <Field label={labels.kind}>{summary.kind}</Field>}
      </dl>
      <div className="mt-6 rounded-card bg-primary p-4 text-on-primary sm:p-6">
        <p className="text-sm uppercase">
          <span>{labels.keyResult}</span>
          <span>{` · ${labels.title}`}</span>
        </p>
        <p className="mt-2 font-heading text-2xl sm:text-3xl">{summary.keyResult}</p>
      </div>
    </>
  );
}
