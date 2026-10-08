import { caseData } from "~/content/route-data.server";
import { alternateLinks, casePath } from "~/lib/i18n";
import { pageMeta } from "~/lib/seo";
import { CaseRouteView } from "./case-view";
import { useLoaderData, type LoaderFunctionArgs, type MetaFunction } from "react-router";

export function loader({ params }: LoaderFunctionArgs) {
  return caseData("es", params.slug);
}

export const meta: MetaFunction<typeof loader> = ({ loaderData }) => {
  if (!loaderData) return [];
  const path = casePath("es", loaderData.case.slug);
  return pageMeta({
    ...loaderData.case.seo,
    path,
    alternates: alternateLinks(path, loaderData.casePairs),
  });
};

export default function Caso() {
  return <CaseRouteView data={useLoaderData<typeof loader>()} />;
}
