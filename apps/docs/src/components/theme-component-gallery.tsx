import { DocsSelect } from "./docs-controls";
import { Button, TextField } from "@dixy-ui/react";
import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Search, X } from "lucide-react";
import { Heading, Text } from "@dixy-ui/react";
import {
  filterThemePreviews,
  themePreviewCategories,
  themePreviewEntries,
  type ThemePreviewEntry,
} from "../lib/theme-preview-catalogue";
import type { DemoState } from "../registry/components";

class DemoBoundary extends Component<
  { children: ReactNode; onRetry: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="theme-gallery-failure" role="alert">
        <Text size="sm">This preview couldn’t load.</Text>
        <Button
          variant="ghost"
          color="neutral"
          size="sm"
          onClick={this.props.onRetry}
        >
          Try again
        </Button>
      </div>
    ) : (
      <div>{this.props.children}</div>
    );
  }
}

function ComponentPreview({ entry }: { entry: ThemePreviewEntry }) {
  const stage = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const Preview = useMemo(
    () =>
      lazy(entry.load as () => Promise<{ default: ComponentType<DemoState> }>),
    [entry, attempt],
  );
  useEffect(() => {
    if (!stage.current) return;
    const root = stage.current.closest("main");
    const bounds = stage.current.getBoundingClientRect();
    const viewport = root?.getBoundingClientRect();
    if (
      viewport &&
      bounds.bottom >= viewport.top - 400 &&
      bounds.top <= viewport.bottom + 400
    ) {
      setReady(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([record]) => {
        if (record?.isIntersecting) {
          setReady(true);
          observer.disconnect();
        }
      },
      { root, rootMargin: "400px" },
    );
    observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section
      className="theme-gallery-card"
      data-component={entry.slug}
      aria-labelledby={`theme-component-${entry.slug}`}
    >
      <header>
        <div>
          <Heading
            as="h4"
            variant="title.sm"
            id={`theme-component-${entry.slug}`}
          >
            {entry.title}
          </Heading>
          <Text variant="caption" tone="muted">
            {entry.description}
          </Text>
        </div>
        {entry.slug !== "layout" && entry.slug !== "icon-button" && (
          <Link
            to="/docs/components/$component"
            params={{ component: entry.slug }}
            aria-label={`${entry.title} documentation`}
            title="View documentation"
          >
            <ArrowUpRight size={14} />
          </Link>
        )}
      </header>
      <div ref={stage} className="theme-gallery-stage" data-loaded={ready}>
        {ready ? (
          <DemoBoundary
            key={attempt}
            onRetry={() => setAttempt((value) => value + 1)}
          >
            <Suspense
              fallback={
                <Text variant="caption" tone="muted" role="status">
                  Loading preview…
                </Text>
              }
            >
              <Preview {...entry.defaults} />
            </Suspense>
          </DemoBoundary>
        ) : (
          <Button
            variant="ghost"
            color="neutral"
            size="sm"
            className="theme-gallery-load"
            onClick={() => setReady(true)}
          >
            Load {entry.title} preview
          </Button>
        )}
      </div>
    </section>
  );
}

export function ThemeComponentGallery({
  onEditFoundations,
}: {
  onEditFoundations: () => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All components");
  const entries = filterThemePreviews(query, category);
  const groups = themePreviewCategories
    .slice(1)
    .map((name) => ({
      name,
      entries: entries.filter((entry) => entry.category === name),
    }))
    .filter((group) => group.entries.length);
  return (
    <section
      className="theme-component-gallery"
      id="theme-component-library"
      tabIndex={-1}
      aria-labelledby="theme-library-heading"
    >
      <div className="theme-gallery-heading">
        <div>
          <span className="theme-sample-kicker">THE WHOLE PICTURE</span>
          <Heading id="theme-library-heading" variant="heading.sm">
            One theme. The whole library.
          </Heading>
          <Text size="sm" tone="muted">
            Try every component, including popups and notifications. They all
            share your foundations.
          </Text>
        </div>
        <span className="theme-gallery-count">
          {themePreviewEntries.length} previews
        </span>
        <a
          className="theme-gallery-edit-foundations"
          href="#theme-foundations"
          onClick={(event) => {
            event.preventDefault();
            onEditFoundations();
          }}
        >
          Edit foundations ↑
        </a>
      </div>
      <div className="theme-gallery-filters">
        <div className="theme-gallery-search">
          <Search size={15} aria-hidden="true" />
          <label className="sr-only" htmlFor="theme-gallery-query">
            Find a component
          </label>
          <TextField
            type="search"
            id="theme-gallery-query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find a component…"
          />
          {query && (
            <Button
              variant="ghost"
              color="neutral"
              size="sm"
              aria-label="Clear component search"
              onClick={() => setQuery("")}
            >
              <X size={14} />
            </Button>
          )}
        </div>
        <label className="theme-gallery-category">
          <span className="sr-only">Component category</span>
          <DocsSelect
            value={category}
            onValueChange={(nextValue) => setCategory(nextValue)}
          >
            {themePreviewCategories.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </DocsSelect>
        </label>
      </div>
      <p className="theme-gallery-results" role="status">
        Showing {entries.length} of {themePreviewEntries.length} previews
      </p>
      {groups.map((group) => (
        <section
          className="theme-gallery-group"
          key={group.name}
          aria-labelledby={`theme-category-${group.name.toLowerCase()}`}
        >
          <div className="theme-gallery-group-heading">
            <Heading
              as="h3"
              variant="title.md"
              id={`theme-category-${group.name.toLowerCase()}`}
            >
              {group.name}
            </Heading>
            <span>{group.entries.length}</span>
          </div>
          <div className="theme-gallery-grid">
            {group.entries.map((entry) => (
              <ComponentPreview key={entry.slug} entry={entry} />
            ))}
          </div>
        </section>
      ))}
      {!entries.length && (
        <div className="theme-gallery-empty">
          <Heading as="h3" variant="title.md">
            No components found.
          </Heading>
          <Text size="sm" tone="muted">
            Try another name or browse the whole library.
          </Text>
          <Button
            variant="ghost"
            color="neutral"
            size="sm"
            onClick={() => {
              setQuery("");
              setCategory("All components");
            }}
          >
            Show all components
          </Button>
        </div>
      )}
    </section>
  );
}
