import { Link } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import { skinCatalog } from "../lib/theme-playground";
import { useAppAppearance } from "./app-appearance-provider";

/**
 * A link to the landing page that keeps the starter you chose. The landing
 * page reads its theme from `?starter=`; the choice is also saved as the docs
 * theme (a cookie), so links home rebuild the query from it instead of
 * dropping back to Original Dixy.
 */
export function HomeLink(props: Omit<ComponentProps<"a">, "href" | "ref">) {
  const { docsTheme } = useAppAppearance();
  const slug = skinCatalog.find((skin) => skin.id === docsTheme.skin)?.slug;
  return <Link {...props} to="/" search={slug ? { starter: slug } : {}} />;
}
