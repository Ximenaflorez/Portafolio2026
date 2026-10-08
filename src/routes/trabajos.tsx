import { loadPage, publishedCases } from "~/content/load.server";
import { pageMeta } from "~/lib/seo";
import type { Route } from "./+types/trabajos";

export function loader() {
  return {
    page: loadPage("es", "trabajos"),
    cases: publishedCases("es", "product"),
    meta: publishedCases("es", "meta")[0] ?? null,
  };
}

export function meta({ loaderData }: Route.MetaArgs) {
  return pageMeta({ ...loaderData.page.seo, path: "/trabajos" });
}

export default function Trabajos() {
  return null;
}
