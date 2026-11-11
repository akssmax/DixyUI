import { createFileRoute } from "@tanstack/react-router";
import { Badge, Tabs } from "@dixy-ui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowUpRight } from "lucide-react";
// The release workflow writes these files; this page only reads them, so it
// shows every published beta without anyone editing it.
import reactLog from "../../../../packages/react/CHANGELOG.md?raw";
import themesLog from "../../../../packages/themes/CHANGELOG.md?raw";
import tokensLog from "../../../../packages/tokens/CHANGELOG.md?raw";
import { parseChangelog, type Release } from "../lib/changelog";

const repo = "https://github.com/akssmax/DixyUI";

const packages = [
  { id: "react", name: "@dixy-ui/react", releases: parseChangelog(reactLog) },
  {
    id: "themes",
    name: "@dixy-ui/themes",
    releases: parseChangelog(themesLog),
  },
  {
    id: "tokens",
    name: "@dixy-ui/tokens",
    releases: parseChangelog(tokensLog),
  },
];

function ReleaseNotes({ name, release }: { name: string; release: Release }) {
  const id = `${name.split("/")[1]}-${release.version}`.replace(/\./g, "-");
  return (
    <section className="changelog-release" aria-labelledby={id}>
      <header className="changelog-release-head">
        <h3 id={id}>{release.version}</h3>
        <a
          className="changelog-npm"
          href={`https://www.npmjs.com/package/${name}/v/${release.version}`}
        >
          npm <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </header>
      {release.changes.map(({ kind, entries }) => (
        <div key={kind} className="changelog-group">
          <Badge
            size="sm"
            variant="soft"
            color={kind === "Patch" ? "neutral" : "accent"}
          >
            {kind === "Patch" ? "Fixes" : `${kind} changes`}
          </Badge>
          <ul>
            {entries.map((entry, index) => (
              <li key={entry.commit ?? index}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {entry.body}
                </ReactMarkdown>
                {entry.commit && (
                  <a
                    className="changelog-commit"
                    href={`${repo}/commit/${entry.commit}`}
                    aria-label={`Commit ${entry.commit} on GitHub`}
                  >
                    {entry.commit}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
      {release.dependencies.length > 0 && (
        <p className="changelog-deps">
          Uses{" "}
          {release.dependencies.map((dep, index) => (
            <span key={dep}>
              {index > 0 && ", "}
              <code>{dep}</code>
            </span>
          ))}
        </p>
      )}
    </section>
  );
}

function Changelog() {
  return (
    <article className="prose-page mdx-content changelog">
      <div className="page-eyebrow">RESOURCES</div>
      <h1>Changelog</h1>
      <p className="page-deck">
        Every published beta, newest first. Each package has its own version.
      </p>
      <p>
        Dixy is in public beta, so APIs may change between releases. The same
        notes ship in each package's <code>CHANGELOG.md</code> and on{" "}
        <a href={`${repo}/releases`}>GitHub releases</a>.
      </p>
      <Tabs.Root defaultValue="react" className="changelog-tabs">
        <Tabs.List aria-label="Package">
          {packages.map((pkg) => (
            <Tabs.Tab key={pkg.id} value={pkg.id}>
              {pkg.name.replace("@dixy-ui/", "")}
              <span className="changelog-latest">
                {pkg.releases[0]?.version}
              </span>
            </Tabs.Tab>
          ))}
          <Tabs.Indicator />
        </Tabs.List>
        {packages.map((pkg) => (
          <Tabs.Panel key={pkg.id} value={pkg.id}>
            {pkg.releases.map((release) => (
              <ReleaseNotes
                key={release.version}
                name={pkg.name}
                release={release}
              />
            ))}
          </Tabs.Panel>
        ))}
      </Tabs.Root>
    </article>
  );
}

export const Route = createFileRoute("/docs/changelog")({
  head: () => ({ meta: [{ title: "Changelog — Dixy UI" }] }),
  component: Changelog,
});
