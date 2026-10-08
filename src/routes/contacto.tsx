import { cvAvailable, loadPage, loadProfile } from "~/content/load.server";
import { pageMeta } from "~/lib/seo";
import type { Route } from "./+types/contacto";

export function loader() {
  const profile = loadProfile("es");
  return { page: loadPage("es", "contacto"), profile, cvAvailable: cvAvailable(profile.cv) };
}

export function meta({ loaderData }: Route.MetaArgs) {
  return pageMeta({ ...loaderData.page.seo, path: "/contacto" });
}

export default function Contacto() {
  return null;
}
