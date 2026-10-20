import {
  Children,
  isValidElement,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import {
  extractSections,
  headingTitle,
  padSection,
  slugify,
  splitBySection,
} from "~/lib/case-sections";
import { Figure } from "../atoms/Figure";
import { Heading } from "../atoms/Heading";
import { Text } from "../atoms/Text";
import { TextLink } from "../atoms/TextLink";

// El texto se limita a ~65 caracteres por línea; las figuras usan todo el ancho (FR-035).
const prose = "max-w-prose";

function textOf(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") return String(child);
      if (isValidElement(child)) {
        if (child.type === "br") return "\n";
        return textOf((child as ReactElement<{ children?: ReactNode }>).props.children);
      }
      return "";
    })
    .join("");
}

function isElementOfType(
  node: ReactNode,
  type: unknown,
): node is ReactElement<{ children?: ReactNode }> {
  return isValidElement(node) && node.type === type;
}

function firstStrongText(node: ReactNode): string | undefined {
  for (const child of Children.toArray(node)) {
    if (!isValidElement<{ children?: ReactNode }>(child)) continue;
    if (child.type === "strong") return textOf(child.props.children);
    const nested = firstStrongText(child.props.children);
    if (nested) return nested;
  }
  return undefined;
}

const figure = String.raw`\d[\d.,]*(?:\s*(?:%|d[ií]as|days|clics?|clicks?))?`;

function isStatLabel(label: string): boolean {
  return new RegExp(`^${figure}$`, "i").test(label.trim());
}

type Field = { label: string; body: string };
type Piece =
  | { type: "fields"; items: Field[] }
  | { type: "label"; label: string }
  | { type: "md"; text: string };

function fieldOf(block: string): Field | undefined {
  const match = block.match(/^\*\*([^*\n]+):\*\*\s*([\s\S]*)$/);
  if (!match || block.startsWith("-")) return undefined;
  return { label: match[1].trim(), body: match[2].trim() };
}

/** Una nota vacía de contenido: el cuerpo es solo «Por completar» / «To complete». */
function gapOf(body: string): string | undefined {
  const match = body.match(/^(?:\*|_)((?:Por completar|To complete)\b[\s\S]*?)(?:\*|_)$/i);
  return match ? match[1].trim() : undefined;
}

function isNarrative(label: string): boolean {
  return /^(resultados|results)$/i.test(label);
}

/** El relato principal y el último dato suelto ocupan la fila; el resto va de a dos. */
function spansRow(index: number, items: Field[]): boolean {
  if (isNarrative(items[index].label)) return true;
  const compact = items.flatMap((item, i) => (isNarrative(item.label) ? [] : [i]));
  return compact.length % 2 === 1 && index === compact[compact.length - 1];
}

function piecesOf(text: string): Piece[] {
  const out: Piece[] = [];
  let fields: Field[] = [];
  const flush = () => {
    if (fields.length === 0) return;
    out.push({ type: "fields", items: fields });
    fields = [];
  };
  for (const block of text
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean)) {
    const field = fieldOf(block);
    if (field?.body) {
      fields.push(field);
      continue;
    }
    flush();
    if (field) out.push({ type: "label", label: field.label });
    else out.push({ type: "md", text: block });
  }
  flush();
  return out;
}

function peelChunk(chunk: string): { title: string; kicker?: string; rest: string } {
  const title = headingTitle(chunk.match(/^##\s+(.+?)\s*$/m)?.[1] ?? "");
  let rest = chunk.replace(/^##\s+.+?\n+/, "");
  const kicker = rest.match(/^(?:\*|_)([^*\n_]+)(?:\*|_)[ \t]*\n*/);
  if (!kicker) return { title, rest: rest.trim() };
  return { title, kicker: kicker[1].trim(), rest: rest.slice(kicker[0].length).trim() };
}

// Función con nombre propio para que el párrafo reconozca que contiene solo una imagen.
function MarkdownImage({ src, alt, title }: ComponentProps<"img">) {
  return <Figure src={String(src ?? "")} alt={alt ?? ""} caption={title ?? alt ?? ""} />;
}

function buildComponents(): Components {
  return {
    // El h1 de la página es el título del caso: ningún encabezado del cuerpo puede serlo (FR-014).
    h1: ({ children }) => <Heading level={2}>{children}</Heading>,
    h2: ({ children }) => {
      const title = headingTitle(textOf(children));
      const id = slugify(title);
      // El apoyo visual ya tiene su título en la sección; no se repite en el cuerpo.
      if (id === "apoyo-visual" || id === "visual-support") return null;
      return (
        <Heading level={2} size="3xl" id={`titulo-${id}`}>
          {title}
        </Heading>
      );
    },
    h3: ({ children }) => (
      <Heading level={3} className="mt-4">
        {children}
      </Heading>
    ),
    h4: ({ children }) => (
      <Heading level={4} className="mt-3">
        {children}
      </Heading>
    ),
    p: ({ children }) => {
      const [first, ...rest] = Children.toArray(children);

      // Una imagen sola en su párrafo es una figura: no puede quedar dentro de un `<p>`.
      if (rest.length === 0 && isElementOfType(first, MarkdownImage)) return first;

      // Una línea solo en cursiva es la pregunta de cada sección (tensión, descubrimiento…).
      if (rest.length === 0 && isElementOfType(first, "em")) {
        return (
          <Text tone="muted" size="sm" className="mt-4">
            {first.props.children}
          </Text>
        );
      }

      // «**Etiqueta:** texto»: la etiqueta va en negrita encima del texto.
      if (isElementOfType(first, "strong") && textOf(first.props.children).trim().endsWith(":")) {
        const label = textOf(first.props.children).trim().replace(/:$/, "");
        if (/insight|rumbo|course/i.test(label)) {
          return (
            <p className="mt-2">
              <strong className="block text-sm font-normal uppercase text-text-muted">
                {label}
              </strong>
              <span className="mt-2 block font-heading text-xl">{rest}</span>
            </p>
          );
        }
        return (
          <p className={`mt-2 ${prose}`}>
            <strong className="block">{label}</strong>
            {rest}
          </p>
        );
      }

      return <Text className={`mt-2 ${prose}`}>{children}</Text>;
    },
    ul: ({ children }) => {
      const labels = Children.toArray(children)
        .filter(isValidElement<{ children?: ReactNode }>)
        .map((item) => firstStrongText(item.props.children)?.trim() ?? "");
      if (labels.length >= 2 && labels.every(isStatLabel)) {
        return <ul className="mt-4 grid gap-4 sm:grid-cols-3">{children}</ul>;
      }
      if (labels.length >= 2 && labels.every((label) => label.endsWith(":"))) {
        return <ul className="mt-4 grid list-none gap-4 p-0 sm:grid-cols-2">{children}</ul>;
      }
      return <ul className={`mt-2 list-disc space-y-1 pl-4 ${prose}`}>{children}</ul>;
    },
    li: ({ children }) => {
      const text = textOf(children).trim();
      const stat = text.match(new RegExp(`^(${figure})\\s+(.+)$`, "i"));
      if (stat) {
        return (
          <li className="rounded-card border border-border bg-surface p-4">
            <strong className="block font-heading text-3xl font-normal text-primary">
              {stat[1]}
            </strong>
            <span className="mt-1 block text-sm text-text-muted">{stat[2]}</span>
          </li>
        );
      }
      const label = firstStrongText(children)?.trim() ?? "";
      if (label.endsWith(":")) {
        const [amount, ...detail] = text.slice(label.length).trim().split(/\n+/);
        return (
          <li className="rounded-card border border-border bg-surface p-4">
            <strong className="block text-sm font-normal text-primary">
              {label.replace(/:$/, "")}
            </strong>
            <span className="mt-1 block font-heading text-2xl">{amount}</span>
            {detail.length > 0 && (
              <span className="mt-1 block text-sm text-text-muted">{detail.join(" ")}</span>
            )}
          </li>
        );
      }
      return <li>{children}</li>;
    },
    em: ({ children }) => <em className="text-text-muted">{children}</em>,
    ol: ({ children }) => (
      <ol className={`mt-2 list-decimal space-y-1 pl-4 ${prose}`}>{children}</ol>
    ),
    blockquote: ({ children }) => (
      <blockquote className={`mt-6 border-l-indicator border-primary pl-4 ${prose}`}>
        {children}
      </blockquote>
    ),
    a: ({ href, children }) => <TextLink href={href ?? "#"}>{children}</TextLink>,
    img: MarkdownImage,
  };
}

function FieldGrid({ items, components }: { items: Field[]; components: Components }) {
  return (
    <div className="mt-6 grid gap-x-8 gap-y-6 md:grid-cols-2">
      {items.map((item, index) => {
        const gap = gapOf(item.body);
        return (
          <div key={item.label} className={spansRow(index, items) ? "md:col-span-2" : undefined}>
            <strong className="block text-sm font-normal uppercase text-text-muted">
              {item.label}
            </strong>
            {gap ? (
              <p className="mt-2 rounded-card border border-dashed border-primary bg-secondary-container p-4">
                {gap}
              </p>
            ) : (
              <ReactMarkdown components={components}>{item.body}</ReactMarkdown>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function CaseBody({ markdown }: { markdown: string }) {
  const components = buildComponents();
  const numbers = new Map(extractSections(markdown).map((section) => [section.id, section.number]));
  const { intro, sections } = splitBySection(markdown);

  return (
    <div>
      {intro.trim() !== "" && <ReactMarkdown components={components}>{intro}</ReactMarkdown>}
      {sections.map((chunk) => {
        const { title, kicker, rest } = peelChunk(chunk);
        const id = slugify(title);
        const number = numbers.get(id);
        const visual = id === "apoyo-visual" || id === "visual-support";
        return (
          <section
            key={id}
            id={id}
            aria-labelledby={`titulo-${id}`}
            className="mt-12 border-t border-border pt-6"
          >
            {kicker && number ? (
              <p className="text-sm text-primary">{`${padSection(number)} · ${kicker}`}</p>
            ) : null}
            <Heading level={2} size="3xl" id={`titulo-${id}`} className={visual ? "sr-only" : ""}>
              {title}
            </Heading>
            {piecesOf(rest).map((piece, index) => {
              if (piece.type === "fields") {
                return <FieldGrid key={index} items={piece.items} components={components} />;
              }
              if (piece.type === "label") {
                return (
                  <p key={index} className="mt-6 text-sm uppercase text-text-muted">
                    {piece.label}
                  </p>
                );
              }
              return (
                <ReactMarkdown key={index} components={components}>
                  {piece.text}
                </ReactMarkdown>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}
