/**
 * Reads a Changesets CHANGELOG.md into releases the docs can render.
 * The package changelogs are the source of truth: the release workflow writes
 * them, so this page updates with every published beta and is never edited
 * by hand.
 */

export type ChangeKind = "Major" | "Minor" | "Patch";

export interface ChangeEntry {
  /** Short commit hash Changesets prefixes each entry with, when present. */
  commit?: string;
  /** The entry as Markdown, with its continuation lines un-indented. */
  body: string;
}

export interface Release {
  version: string;
  changes: { kind: ChangeKind; entries: ChangeEntry[] }[];
  /** Workspace packages this release moved to, e.g. "@dixy-ui/tokens@0.1.0-beta.3". */
  dependencies: string[];
}

const kinds: Record<string, ChangeKind> = {
  "Major Changes": "Major",
  "Minor Changes": "Minor",
  "Patch Changes": "Patch",
};

/** Split a section into its top-level "- " list items. */
function items(section: string): string[] {
  const out: string[] = [];
  for (const line of section.split("\n")) {
    if (line.startsWith("- ")) out.push(line.slice(2));
    else if (out.length) out[out.length - 1] += "\n" + line;
  }
  return out.map((item) => item.replace(/\n+$/, ""));
}

export function parseChangelog(markdown: string): Release[] {
  const releases: Release[] = [];
  for (const block of markdown.split(/^## /m).slice(1)) {
    const [heading = "", ...rest] = block.split("\n");
    const release: Release = {
      version: heading.trim(),
      changes: [],
      dependencies: [],
    };
    for (const part of rest.join("\n").split(/^### /m).slice(1)) {
      const [title = "", ...body] = part.split("\n");
      const kind = kinds[title.trim()];
      if (!kind) continue;
      const entries: ChangeEntry[] = [];
      for (const item of items(body.join("\n"))) {
        if (item.startsWith("Updated dependencies")) {
          // The sub-list under it names the versions this release now uses.
          for (const match of item.matchAll(/^\s+- (@\S+)$/gm))
            if (!release.dependencies.includes(match[1]!))
              release.dependencies.push(match[1]!);
          continue;
        }
        const commit = /^([0-9a-f]{7,40}): /.exec(item);
        const text = commit ? item.slice(commit[0].length) : item;
        entries.push({
          commit: commit?.[1],
          body: text.replace(/^ {2}/gm, ""),
        });
      }
      if (entries.length) release.changes.push({ kind, entries });
    }
    releases.push(release);
  }
  return releases;
}
