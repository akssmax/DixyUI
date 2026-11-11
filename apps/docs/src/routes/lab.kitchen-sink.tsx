import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Component,
  Suspense,
  lazy,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { Heading, SearchField, Skeleton, Text, Theme } from "@dixy-ui/react";
import { useAppAppearance } from "../components/app-appearance-provider";
import {
  componentRegistry,
  type Control,
  type DemoState,
} from "../registry/components";
import { playgroundThemeProps, skinThemePreset } from "../lib/theme-playground";
import { skinCatalog } from "@dixy-ui/themes/catalog";
import { loadStarterStyles } from "../lib/theme-engine";
import { deduplicateSkinStyles } from "../lib/theme-skin-catalogue";
import "../styles/kitchen-sink.css";

/**
 * Kitchen sink: every registered component demo on one page, at its default
 * controls, grouped by category. It reads the registry, so new components
 * appear here automatically. Use `?skin=` to review a starter skin and the
 * search box to narrow the page. Each tile has its own error boundary, so a
 * broken demo shows up as a red tile instead of blanking the page.
 */
type Entry = (typeof componentRegistry)[keyof typeof componentRegistry] & {
  controls?: readonly Control[];
};

const entries = (Object.entries(componentRegistry) as [string, Entry][]).sort(
  ([, a], [, b]) => a.title.localeCompare(b.title),
);
const categories = [...new Set(entries.map(([, e]) => e.category))].sort();

export const Route = createFileRoute("/lab/kitchen-sink")({
  validateSearch: (search: Record<string, unknown>): { skin?: string } => ({
    skin: skinCatalog.some((skin) => skin.slug === search.skin)
      ? (search.skin as string)
      : undefined,
  }),
  loaderDeps: ({ search }) => ({
    id: skinCatalog.find((skin) => skin.slug === search.skin)?.id ?? "none",
  }),
  loader: ({ deps }) => loadStarterStyles(deps.id),
  head: ({ loaderData }) => ({
    meta: [{ title: "Kitchen sink — Dixy UI lab" }],
    styles: [
      ...(loaderData?.css
        ? [{ "data-dixy-skin-style": loaderData.id, children: loaderData.css }]
        : []),
      ...(loaderData?.materialCSS
        ? [{ children: loaderData.materialCSS }]
        : []),
    ],
  }),
  component: KitchenSink,
});

class TileBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    return this.state.error ? (
      <div className="ks-error" role="alert">
        Demo crashed: {this.state.error.message}
      </div>
    ) : (
      this.props.children
    );
  }
}

function Tile({ slug, entry }: { slug: string; entry: Entry }) {
  const Preview = useMemo(
    () =>
      lazy(
        entry.load as unknown as () => Promise<{
          default: ComponentType<DemoState>;
        }>,
      ),
    [entry],
  );
  const props = useMemo(
    () =>
      Object.fromEntries(
        (entry.controls ?? []).map((control) => [
          control.name,
          control.initial,
        ]),
      ) as DemoState,
    [entry],
  );
  return (
    <section className="ks-tile" id={slug} aria-labelledby={`${slug}-title`}>
      <header className="ks-tile-head">
        <Heading as="h3" id={`${slug}-title`} variant="title.sm">
          {entry.title}
        </Heading>
        <Link
          to="/docs/components/$component"
          params={{ component: slug }}
          className="ks-docs-link"
        >
          Docs
        </Link>
      </header>
      <div className="ks-stage">
        <TileBoundary>
          <Suspense fallback={<Skeleton className="ks-skeleton" />}>
            <Preview {...props} />
          </Suspense>
        </TileBoundary>
      </div>
    </section>
  );
}

function KitchenSink() {
  const { id } = Route.useLoaderData();
  const { appearance } = useAppAppearance();
  const [query, setQuery] = useState("");
  // Demos are client-only: 100+ lazy chunks would otherwise all stream on SSR.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => deduplicateSkinStyles(id), [id]);
  const themeProps = useMemo(
    () => playgroundThemeProps({ ...skinThemePreset(id), appearance }),
    [id, appearance],
  );
  const q = query.trim().toLowerCase();
  const visible = entries.filter(
    ([slug, entry]) =>
      !q ||
      entry.title.toLowerCase().includes(q) ||
      slug.includes(q) ||
      entry.category.toLowerCase().includes(q),
  );

  return (
    <Theme {...themeProps} className="ks-page">
      <main className="ks-main">
        <header className="ks-head">
          <div>
            <Heading as="h1" variant="heading.sm">
              Kitchen sink
            </Heading>
            <Text tone="muted">
              {visible.length} of {entries.length} component demos at their
              default controls.
            </Text>
          </div>
          <SearchField.Root
            value={query}
            onChange={setQuery}
            aria-label="Filter components"
            className="ks-search"
          >
            <SearchField.Group>
              <SearchField.Input placeholder="Filter by name or category…" />
              <SearchField.Clear />
            </SearchField.Group>
          </SearchField.Root>
        </header>
        <nav className="ks-index" aria-label="Categories">
          {categories.map((category) => (
            <a key={category} href={`#cat-${category}`}>
              {category}
            </a>
          ))}
        </nav>
        {categories.map((category) => {
          const group = visible.filter(([, e]) => e.category === category);
          if (!group.length) return null;
          return (
            <section
              key={category}
              id={`cat-${category}`}
              className="ks-category"
              aria-labelledby={`cat-${category}-title`}
            >
              <Heading as="h2" id={`cat-${category}-title`} variant="title.md">
                {category} <span className="ks-count">{group.length}</span>
              </Heading>
              <div className="ks-grid">
                {group.map(([slug, entry]) =>
                  mounted ? (
                    <Tile key={slug} slug={slug} entry={entry} />
                  ) : (
                    <div key={slug} className="ks-tile">
                      <Skeleton className="ks-skeleton" />
                    </div>
                  ),
                )}
              </div>
            </section>
          );
        })}
      </main>
    </Theme>
  );
}
