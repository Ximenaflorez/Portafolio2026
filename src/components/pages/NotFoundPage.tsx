import { homePath } from "~/lib/i18n";
import { translator } from "~/lib/ui";
import { Heading } from "../atoms/Heading";
import { TextLink } from "../atoms/TextLink";

const es = translator("es");
const en = translator("en");

// Un solo `404.html` para los dos idiomas (contracts/routes.md): el título y el enlace de vuelta
// van en ambos, cada uno con su `lang`.
export function NotFoundPage() {
  return (
    <main
      id="contenido"
      tabIndex={-1}
      className="mx-auto min-h-screen w-full max-w-content bg-background px-3 py-12 focus:outline-none md:px-4"
    >
      <Heading level={1}>
        <span lang="es">{es("notFound.title")}</span> ·{" "}
        <span lang="en">{en("notFound.title")}</span>
      </Heading>
      <ul className="mt-4 flex flex-col">
        <li>
          <TextLink variant="standalone" href={homePath("es")} lang="es" hrefLang="es">
            {es("notFound.back")}
          </TextLink>
        </li>
        <li>
          <TextLink variant="standalone" href={homePath("en")} lang="en" hrefLang="en">
            {en("notFound.back")}
          </TextLink>
        </li>
      </ul>
    </main>
  );
}
