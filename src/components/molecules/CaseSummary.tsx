import type { ReactNode } from "react";
import type { CaseSummary as Summary } from "~/content/schema";
import { Heading } from "../atoms/Heading";

export type CaseSummaryLabels = {
  title: string;
  product: string;
  role: string;
  team: string;
  duration: string;
  keyResult: string;
};

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="font-semibold">{label}</dt>
      <dd className="mt-0.5">{children}</dd>
    </div>
  );
}

// Cuadrícula de datos en una tarjeta con borde; el resultado clave ocupa todo el ancho (FR-035).
export function CaseSummary({
  summary,
  labels,
}: {
  summary: Pick<Summary, "product" | "role" | "team" | "duration" | "keyResult">;
  labels: CaseSummaryLabels;
}) {
  return (
    <>
      <Heading level={2} size="xl" className="mt-6">
        {labels.title}
      </Heading>
      <dl className="mt-2 grid gap-2 rounded-card border border-border bg-surface-tonal p-4 sm:grid-cols-2">
        <Field label={labels.product}>{summary.product}</Field>
        <Field label={labels.role}>{summary.role}</Field>
        {summary.team && <Field label={labels.team}>{summary.team}</Field>}
        <Field label={labels.duration}>{summary.duration}</Field>
        <div className="sm:col-span-2">
          <dt className="font-semibold">{labels.keyResult}</dt>
          <dd className="mt-0.5 text-lg">{summary.keyResult}</dd>
        </div>
      </dl>
    </>
  );
}
