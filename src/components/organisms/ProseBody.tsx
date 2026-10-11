import ReactMarkdown, { type Components } from "react-markdown";
import { Heading } from "../atoms/Heading";
import { Text } from "../atoms/Text";
import { TextLink } from "../atoms/TextLink";

// Texto en Markdown dentro de una sección de `/`: la sección ya tiene su h2, así que los
// encabezados del texto bajan un nivel.
const components: Components = {
  h1: ({ children }) => (
    <Heading level={3} className="mt-6">
      {children}
    </Heading>
  ),
  h2: ({ children }) => (
    <Heading level={3} className="mt-6">
      {children}
    </Heading>
  ),
  h3: ({ children }) => (
    <Heading level={4} className="mt-4">
      {children}
    </Heading>
  ),
  p: ({ children }) => <Text className="mt-2 max-w-prose">{children}</Text>,
  ul: ({ children }) => <ul className="mt-2 max-w-prose list-disc space-y-1 pl-4">{children}</ul>,
  ol: ({ children }) => (
    <ol className="mt-2 max-w-prose list-decimal space-y-1 pl-4">{children}</ol>
  ),
  a: ({ href, children }) => <TextLink href={href ?? "#"}>{children}</TextLink>,
};

export function ProseBody({ markdown }: { markdown: string }) {
  return <ReactMarkdown components={components}>{markdown}</ReactMarkdown>;
}
