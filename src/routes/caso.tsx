import { data, type LoaderFunctionArgs, type MetaFunction } from "react-router";
import { findPublishedCase } from "~/content/load.server";
import { pageMeta } from "~/lib/seo";

export function loader({ params }: LoaderFunctionArgs) {
  const found = params.slug ? findPublishedCase(params.slug) : undefined;
  if (!found || found.type !== "product") throw data(null, { status: 404 });
  return { case: found };
}

export const meta: MetaFunction<typeof loader> = ({ loaderData }) =>
  loaderData
    ? pageMeta({ ...loaderData.case.seo, path: `/trabajos/${loaderData.case.slug}` })
    : [];

export default function Caso() {
  return null;
}
