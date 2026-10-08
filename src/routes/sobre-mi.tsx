import { cvAvailable, loadPage, loadProfile } from "~/content/load.server";
import { pageMeta } from "~/lib/seo";
import type { Route } from "./+types/sobre-mi";

export function loader() {
  const profile = loadProfile("es");
  return { page: loadPage("es", "sobre-mi"), profile, cvAvailable: cvAvailable(profile.cv) };
}

export function meta({ loaderData }: Route.MetaArgs) {
  return pageMeta({ ...loaderData.page.seo, path: "/sobre-mi" });
}

export default function SobreMi() {
  return null;
}
