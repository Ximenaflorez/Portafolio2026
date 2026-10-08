import {
  Children,
  isValidElement,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import { extractSections, headingTitle, slugify, splitBySection } from "~/lib/case-sections";
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

// Función con nombre propio para que el párrafo reconozca que contiene solo una imagen.
function MarkdownImage({ src, alt, title }: ComponentProps<"img">) {
  return <Figure src={String(src ?? "")} alt={alt ?? ""} caption={title ?? alt ?? ""} />;
}

function buildComponents(numbers: Map<string, number>): Components {
  return {
    // El h1 de la página es el título del caso: ningún encabezado del cuerpo puede serlo (FR-014).
    h1: ({ children }) => <Heading level={2}>{children}</Heading>,
    h2: ({ children }) => {
      const title = headingTitle(textOf(children));
      const id = slugify(title);
      const number = numbers.get(id);
      return (
        <Heading level={2} id={`titulo-${id}`}>
          {number ? `${number}. ${title}` : title}
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
          <Text tone="muted" className={`mt-1 ${prose}`}>
            {first.props.children}
          </Text>
        );
      }

      // «**Etiqueta:** texto»: la etiqueta va en negrita encima del texto.
      if (isElementOfType(first, "strong") && textOf(first.props.children).trim().endsWith(":")) {
        const label = textOf(first.props.children).trim().replace(/:$/, "");
        return (
          <p className={`mt-2 ${prose}`}>
            <strong className="block">{label}</strong>
            {rest}
          </p>
        );
      }

      return <Text className={`mt-2 ${prose}`}>{children}</Text>;
    },
    ul: ({ children }) => <ul className={`mt-2 list-disc space-y-1 pl-4 ${prose}`}>{children}</ul>,
    ol: ({ children }) => (
      <ol className={`mt-2 list-decimal space-y-1 pl-4 ${prose}`}>{children}</ol>
    ),
    blockquote: ({ children }) => (
      <blockquote
        className={`mt-2 border-l-indicator border-border-strong pl-2 text-text-muted ${prose}`}
      >
        {children}
      </blockquote>
    ),
    a: ({ href, children }) => <TextLink href={href ?? "#"}>{children}</TextLink>,
    img: MarkdownImage,
  };
}

export function CaseBody({ markdown }: { markdown: string }) {
  const components = buildComponents(
    new Map(extractSections(markdown).map((section) => [section.id, section.number])),
  );
  const { intro, sections } = splitBySection(markdown);

  return (
    <div>
      {intro.trim() !== "" && <ReactMarkdown components={components}>{intro}</ReactMarkdown>}
      {sections.map((chunk) => {
        const id = slugify(headingTitle(chunk.match(/^##\s+(.+?)\s*$/m)?.[1] ?? ""));
        return (
          <section
            key={id}
            id={id}
            aria-labelledby={`titulo-${id}`}
            className="mt-12 border-t border-border pt-6"
          >
            <ReactMarkdown components={components}>{chunk}</ReactMarkdown>
          </section>
        );
      })}
    </div>
  );
}
