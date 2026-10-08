import { metaCaseData } from "~/content/route-data.server";
import { alternateLinks, metaCasePath } from "~/lib/i18n";
import { pageMeta } from "~/lib/seo";
import { CaseRouteView } from "../case-view";
import { useLoaderData, type MetaFunction } from "react-router";

export function loader() {
  return metaCaseData("en");
}

export const meta: MetaFunction<typeof loader> = ({ loaderData }) => {
  if (!loaderData) return [];
  const path = metaCasePath("en");
  return pageMeta({
    ...loaderData.case.seo,
    path,
    alternates: alternateLinks(path, loaderData.casePairs),
  });
};

export default function MetaCase() {
  return <CaseRouteView data={useLoaderData<typeof loader>()} />;
}
