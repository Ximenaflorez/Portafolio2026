import { loadPage, loadProfile, publishedCases } from "~/content/load.server";
import { pageMeta } from "~/lib/seo";
import type { Route } from "./+types/inicio";

export function loader() {
  return {
    page: loadPage("inicio"),
    profile: loadProfile(),
    cases: publishedCases("product"),
  };
}

export function meta({ loaderData }: Route.MetaArgs) {
  return pageMeta({ ...loaderData.page.seo, path: "/" });
}

export default function Inicio() {
  return null;
}
