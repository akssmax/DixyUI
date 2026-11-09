import { Button } from "@dixy-ui/react";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  Link,
  useLocation,
} from "@tanstack/react-router";
import { DocsShell } from "../components/docs-shell";
import { AppAppearanceProvider } from "../components/app-appearance-provider";
import { getAppPreferences } from "../lib/app-appearance.functions";
import "@fontsource/jetbrains-mono/latin-400.css";
import "@dixy-ui/react/styles.css";
import "../styles/docs.css";

function RoutedContent() {
  const pathname = useLocation({ select: (location) => location.pathname });
  // The landing page and the playground bring their own full-width chrome.
  return pathname === "/" ||
    pathname === "/playground" ||
    pathname.startsWith("/lab/") ||
    pathname === "/dixy-example" ? (
    <Outlet />
  ) : (
    <DocsShell>
      <Outlet />
    </DocsShell>
  );
}

export const Route = createRootRoute({
  loader: () => getAppPreferences(),
  staleTime: Infinity,
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Dixy UI — Components with character" },
      {
        name: "description",
        content:
          "Dixy UI is an expressive React design system built on Base UI. Explore accessible components, understand the decisions, and make it yours.",
      },
      { name: "theme-color", content: "#fcfaf7" },
    ],
    links: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
  }),
  component: RootDocument,
  notFoundComponent: () => (
    <div className="empty-page">
      <span className="eyebrow">404 / A SMALL DETOUR</span>
      <h1>This page hasn’t taken shape.</h1>
      <p>Head back to the components and keep exploring.</p>
      <Link to="/">Back to overview →</Link>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="empty-page">
      <h1>Something interrupted this page.</h1>
      <p>{error instanceof Error ? error.message : String(error)}</p>
      <Button variant="ghost" color="neutral" size="sm" onClick={reset}>
        Try again
      </Button>
    </div>
  ),
});

function RootDocument() {
  const { appearance, previewTheme } = Route.useLoaderData();
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <AppAppearanceProvider
          initialAppearance={appearance}
          initialPreviewTheme={previewTheme}
        >
          <RoutedContent />
        </AppAppearanceProvider>
        <Scripts />
      </body>
    </html>
  );
}
