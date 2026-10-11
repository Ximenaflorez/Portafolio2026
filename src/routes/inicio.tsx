import { homeData } from "~/content/route-data.server";
import { alternateLinks, homePath } from "~/lib/i18n";
import { pageMeta } from "~/lib/seo";
import { HomeRouteView } from "./home-view";
import type { Route } from "./+types/inicio";

export function loader() {
  return homeData("es");
}

export function meta({ loaderData }: Route.MetaArgs) {
  const path = homePath("es");
  return pageMeta({
    ...loaderData.page.seo,
    path,
    alternates: alternateLinks(path, loaderData.casePairs),
  });
}

export default function Inicio({ loaderData }: Route.ComponentProps) {
  return <HomeRouteView data={loaderData} />;
}
