import { caseData } from "~/content/route-data.server";
import { alternateLinks, casePath } from "~/lib/i18n";
import { pageMeta } from "~/lib/seo";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";

export function loader({ params }: LoaderFunctionArgs) {
  return caseData("en", params.slug);
}

export const meta: MetaFunction<typeof loader> = ({ loaderData }) => {
  if (!loaderData) return [];
  const path = casePath("en", loaderData.case.slug);
  return pageMeta({
    ...loaderData.case.seo,
    path,
    alternates: alternateLinks(path, loaderData.casePairs),
  });
};

export default function Case() {
  return null;
}
