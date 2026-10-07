import { data, type MetaFunction } from "react-router";
import { publishedCases } from "~/content/load.server";
import { pageMeta } from "~/lib/seo";

export function loader() {
  const found = publishedCases("meta")[0];
  if (!found) throw data(null, { status: 404 });
  return { case: found };
}

export const meta: MetaFunction<typeof loader> = ({ loaderData }) =>
  loaderData ? pageMeta({ ...loaderData.case.seo, path: "/trabajos/este-portafolio" }) : [];

export default function CasoMeta() {
  return null;
}
