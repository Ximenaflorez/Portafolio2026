import { HomePage } from "~/components/pages/HomePage";
import type { homeData } from "~/content/route-data.server";

// Vista compartida por `/` y `/en/`: el idioma lo da la ruta.
export function HomeRouteView({ data }: { data: ReturnType<typeof homeData> }) {
  return (
    <HomePage
      profile={data.profile}
      cvAvailable={data.cvAvailable}
      metaCaseHref={data.metaCaseHref}
      casePairs={data.casePairs}
      cases={data.cases}
      meta={data.meta}
      about={data.about}
      contactCall={data.page.body}
    />
  );
}
