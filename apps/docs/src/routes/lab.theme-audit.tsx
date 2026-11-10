import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Heading,
  Switch,
  Tabs,
  Text,
  TextField,
  Theme,
  Toggle,
  ToggleGroup,
} from "@dixy-ui/react";
import {
  playgroundThemeProps,
  serializeThemePreset,
  skinCatalog,
  skinThemePreset,
} from "../lib/theme-playground";
import { installedThemeDocuments } from "../lib/theme-authoring";
import { loadMaterialCSS, prepareSkin } from "../lib/theme-skin-catalogue";
import {
  auditSpecimen,
  installFocusMirror,
  type AuditIssue,
} from "../lib/theme-audit";
import "../styles/theme-audit.css";

/**
 * Theme audit: every built-in theme rendered on the same specimen in light
 * and dark, then measured in the browser for text contrast, focus
 * indicators, target size and clipped labels.
 *
 * Built for an agent loop (see .claude/skills/theme-audit): the finished
 * report is on `window.__dixyThemeAudit`, `<html data-audit-status="done">`
 * marks completion, and on the dev server it is also written to
 * `.dixy/theme-audit.json`. Fixes are applied with `pnpm themes:fix`.
 */
type Appearance = "light" | "dark";
const appearances: readonly Appearance[] = ["light", "dark"];

export interface ThemeAuditReport {
  generatedAt: string;
  url: string;
  totals: { themes: number; fail: number; warn: number; clean: number };
  themes: {
    id: string;
    name: string;
    defaultAppearance: Appearance;
    fail: number;
    warn: number;
    /** Values a fix usually changes; patch these with `pnpm themes:fix`. */
    foundations: Record<string, unknown>;
    material: { id: string; parameters: Record<string, unknown> } | null;
  }[];
  issues: (AuditIssue & { theme: string; appearance: Appearance })[];
}

declare global {
  interface Window {
    __dixyThemeAudit?: ThemeAuditReport;
  }
}

export const Route = createFileRoute("/lab/theme-audit")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { theme?: string; appearance?: Appearance; issues?: boolean } => ({
    theme: skinCatalog.some((skin) => skin.slug === search.theme)
      ? (search.theme as string)
      : undefined,
    appearance:
      search.appearance === "light" || search.appearance === "dark"
        ? search.appearance
        : undefined,
    issues: search.issues === true || search.issues === "true" || undefined,
  }),
  head: () => ({ meta: [{ title: "Theme audit — Dixy UI lab" }] }),
  component: ThemeAudit,
});

function Specimen({ id, appearance }: { id: string; appearance: Appearance }) {
  const meta = skinCatalog.find((skin) => skin.id === id)!;
  const props = playgroundThemeProps(
    { ...skinThemePreset(id), appearance },
    appearance,
  );
  return (
    <Theme
      {...props}
      animateOrnaments={false}
      className="audit-specimen"
      data-audit-theme={id}
      data-audit-appearance={appearance}
    >
      <Card.Root>
        <Card.Content className="audit-specimen-body">
          <Card.Title as="h3" data-audit="heading">
            {meta.voice.headline}
          </Card.Title>
          <Card.Description data-audit="text-body">
            {meta.voice.body}
          </Card.Description>
          <div className="audit-row">
            <Button size="sm" data-audit="button-solid">
              {meta.voice.primary}
            </Button>
            <Button
              size="sm"
              variant="outline"
              color="neutral"
              data-audit="button-outline"
            >
              {meta.voice.secondary}
            </Button>
            <Button size="sm" variant="soft" data-audit="button-soft">
              Soft
            </Button>
          </div>
          <TextField
            aria-label={`${meta.name} ${appearance} field`}
            defaultValue="Field text"
            data-audit="input"
          />
          <div className="audit-row">
            <Switch.Root
              defaultChecked
              aria-label={`${meta.name} ${appearance} switch`}
              data-audit="switch"
            >
              <Switch.Thumb />
            </Switch.Root>
            <Checkbox.Root
              defaultChecked
              aria-label={`${meta.name} ${appearance} checkbox`}
              data-audit="checkbox"
            >
              <Checkbox.Indicator />
            </Checkbox.Root>
            <Badge variant="soft" data-audit="badge">
              Badge
            </Badge>
            <Text size="sm" tone="muted" data-audit="text-muted">
              Muted text
            </Text>
          </div>
          <div className="audit-row">
            <Tabs.Root defaultValue="overview">
              <Tabs.List aria-label={`${meta.name} ${appearance} tabs`}>
                <Tabs.Tab value="overview" data-audit="tab-selected">
                  Overview
                </Tabs.Tab>
                <Tabs.Tab value="activity" data-audit="tab">
                  Activity
                </Tabs.Tab>
                <Tabs.Indicator />
              </Tabs.List>
            </Tabs.Root>
            <Tabs.Root defaultValue="list" variant="segmented">
              <Tabs.List aria-label={`${meta.name} ${appearance} view`}>
                <Tabs.Tab value="list" data-audit="tab-filled-selected">
                  List
                </Tabs.Tab>
                <Tabs.Tab value="board" data-audit="tab-filled">
                  Board
                </Tabs.Tab>
                <Tabs.Indicator />
              </Tabs.List>
            </Tabs.Root>
            <ToggleGroup
              aria-label={`${meta.name} ${appearance} range`}
              segmented
              defaultValue={["day"]}
            >
              <Toggle value="day" size="sm" data-audit="segment-selected">
                Day
              </Toggle>
              <Toggle value="week" size="sm" data-audit="segment">
                Week
              </Toggle>
            </ToggleGroup>
          </div>
        </Card.Content>
      </Card.Root>
    </Theme>
  );
}

function buildReport(ids: readonly string[]): ThemeAuditReport {
  const issues: ThemeAuditReport["issues"] = [];
  const removeMirror = installFocusMirror();
  for (const element of document.querySelectorAll<HTMLElement>(
    "[data-audit-theme]",
  )) {
    const theme = element.dataset.auditTheme!;
    const appearance = element.dataset.auditAppearance as Appearance;
    for (const issue of auditSpecimen(element))
      issues.push({ ...issue, theme, appearance });
  }
  removeMirror();
  const themes = ids.map((id) => {
    const meta = skinCatalog.find((skin) => skin.id === id)!;
    const document = installedThemeDocuments[id];
    const own = issues.filter((issue) => issue.theme === id);
    return {
      id,
      name: meta.name,
      defaultAppearance: meta.appearance as Appearance,
      fail: own.filter((issue) => issue.severity === "fail").length,
      warn: own.filter((issue) => issue.severity === "warn").length,
      foundations: { ...(document?.foundations ?? {}) },
      material: document
        ? {
            id: document.recipes.material.id,
            parameters: { ...document.recipes.material.parameters },
          }
        : null,
    };
  });
  return {
    generatedAt: new Date().toISOString(),
    url: location.pathname + location.search,
    totals: {
      themes: themes.length,
      fail: issues.filter((issue) => issue.severity === "fail").length,
      warn: issues.filter((issue) => issue.severity === "warn").length,
      clean: themes.filter((theme) => !theme.fail && !theme.warn).length,
    },
    themes,
    issues,
  };
}

const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

function ThemeAudit() {
  const search = Route.useSearch();
  const ids = skinCatalog
    .filter((skin) => !search.theme || skin.slug === search.theme)
    .map((skin) => skin.id);
  const shown = search.appearance ? [search.appearance] : appearances;
  const [ready, setReady] = useState(false);
  const [report, setReport] = useState<ThemeAuditReport | null>(null);
  const [saved, setSaved] = useState("");
  const idsKey = ids.join(",");
  const run = useRef(0);

  // Load every skin's CSS (and materials) before rendering specimens.
  useEffect(() => {
    let live = true;
    setReady(false);
    setReport(null);
    document.documentElement.dataset.auditStatus = "loading";
    void Promise.all([
      ...idsKey.split(",").map((id) => prepareSkin(id)),
      loadMaterialCSS().then((css) => {
        if (document.querySelector("style[data-audit-materials]")) return;
        const style = document.createElement("style");
        style.dataset.auditMaterials = "";
        style.textContent = css;
        document.head.append(style);
      }),
    ])
      .catch(() => undefined)
      .finally(() => live && setReady(true));
    return () => {
      live = false;
    };
  }, [idsKey]);

  const audit = useCallback(async () => {
    const current = ++run.current;
    document.documentElement.dataset.auditStatus = "running";
    await document.fonts.ready;
    await nextFrame();
    await nextFrame();
    if (current !== run.current) return;
    const next = buildReport(idsKey.split(","));
    setReport(next);
    window.__dixyThemeAudit = next;
    document.documentElement.dataset.auditStatus = "done";
    if (import.meta.env.DEV) {
      try {
        const response = await fetch("/__dixy/theme-audit", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(next),
        });
        setSaved(
          response.ok ? ((await response.json()) as { file: string }).file : "",
        );
      } catch {
        setSaved("");
      }
    }
  }, [idsKey]);

  useEffect(() => {
    if (ready) void audit();
  }, [ready, audit, shown.join()]);

  const byTheme = (id: string) =>
    report?.issues.filter(
      (issue) => issue.theme === id && shown.includes(issue.appearance),
    ) ?? [];
  const rows = ids.filter(
    (id) => !search.issues || !report || byTheme(id).length > 0,
  );

  return (
    <main className="audit-page">
      <header className="audit-head">
        <div>
          <Heading as="h1" variant="heading.sm">
            Theme audit
          </Heading>
          <Text tone="muted">
            Every theme on the same components, measured in this browser: text
            contrast (including selected tabs and segments against every colour
            in their fill), focus indicators, target size and clipped labels.
          </Text>
        </div>
        <div className="audit-actions">
          <Link
            to="/lab/theme-audit"
            search={(prev) => ({
              ...prev,
              issues: prev.issues ? undefined : true,
            })}
            className="audit-link"
          >
            {search.issues ? "Show all themes" : "Only themes with issues"}
          </Link>
          <Button
            size="sm"
            variant="outline"
            color="neutral"
            disabled={!ready}
            onClick={() => void audit()}
          >
            Run again
          </Button>
        </div>
      </header>

      <p className="audit-summary" role="status">
        {!report
          ? "Measuring…"
          : `${report.totals.themes} themes · ${report.totals.fail} failures · ${report.totals.warn} warnings · ${report.totals.clean} clean${saved ? ` · report saved to ${saved}` : ""}`}
      </p>

      {ready &&
        rows.map((id) => {
          const meta = skinCatalog.find((skin) => skin.id === id)!;
          const issues = byTheme(id);
          const fails = issues.filter((issue) => issue.severity === "fail");
          return (
            <section
              key={id}
              className="audit-theme"
              aria-labelledby={`audit-${meta.slug}`}
            >
              <header className="audit-theme-head">
                <h2 id={`audit-${meta.slug}`}>{meta.name}</h2>
                <span
                  className="audit-count"
                  data-state={
                    !report
                      ? "pending"
                      : fails.length
                        ? "fail"
                        : issues.length
                          ? "warn"
                          : "pass"
                  }
                >
                  {!report
                    ? "…"
                    : issues.length
                      ? `${fails.length} fail · ${issues.length - fails.length} warn`
                      : "Clean"}
                </span>
                <code className="audit-id">{id}</code>
                <Link
                  to="/playground"
                  search={{
                    theme: serializeThemePreset({
                      ...skinThemePreset(id),
                      appearance: shown[0] ?? "light",
                    }),
                  }}
                  className="audit-link"
                >
                  Open in playground
                </Link>
              </header>
              <div className="audit-specimens">
                {shown.map((appearance) => (
                  <Specimen key={appearance} id={id} appearance={appearance} />
                ))}
              </div>
              {issues.length > 0 && (
                <ul className="audit-issues">
                  {issues.map((issue, index) => (
                    <li key={index} data-severity={issue.severity}>
                      <span className="audit-tag">{issue.appearance}</span>
                      <span className="audit-tag">{issue.check}</span>
                      {issue.message}
                      {issue.foreground && issue.background && (
                        <span className="audit-swatch" aria-hidden="true">
                          <i style={{ background: issue.foreground }} />
                          <i style={{ background: issue.background }} />
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
    </main>
  );
}
