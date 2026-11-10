/**
 * Streaming markdown helpers. A model sends markdown a few characters at a
 * time, so the text is often half finished: an open code fence turns the rest
 * of the reply into code, and an unpaired `**` shows literal asterisks until
 * its partner arrives. These helpers keep each partial frame readable.
 */

const fencePattern = /^ {0,3}(`{3,}|~{3,})/;
const listPattern = /^ {0,3}(?:[-*+]|\d{1,9}[.)])\s/;

/** Split markdown into top-level blocks at blank lines, never inside a code
 * fence and never between the items of one list. While streaming, only the
 * last block changes, so earlier blocks can skip re-parsing. */
export function splitMarkdownBlocks(markdown: string): string[] {
  const lines = markdown.split("\n");
  const blocks: string[] = [];
  let current: string[] = [];
  let fence: string | null = null;

  const flush = () => {
    if (current.some((line) => line.trim() !== ""))
      blocks.push(current.join("\n"));
    current = [];
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]!;
    const marker = fencePattern.exec(line)?.[1];
    if (fence) {
      current.push(line);
      if (marker && marker[0] === fence[0] && marker.length >= fence.length)
        fence = null;
      continue;
    }
    if (marker) {
      fence = marker;
      current.push(line);
      continue;
    }
    if (line.trim() === "") {
      const next = lines.slice(index + 1).find((l) => l.trim() !== "");
      const inList = current.some((l) => listPattern.test(l));
      const continues =
        next !== undefined &&
        inList &&
        (listPattern.test(next) || /^\s{2,}\S/.test(next));
      if (continues) current.push(line);
      else flush();
      continue;
    }
    current.push(line);
  }
  flush();
  return blocks;
}

/** Close whatever a partial reply leaves open, so it renders as intended:
 * code fences, inline code, bold and strikethrough. A trailing link whose URL
 * has not finished arriving shows as plain text instead of a broken link. */
export function completeMarkdown(markdown: string): string {
  let fence: string | null = null;
  let fenceEnd = 0;
  let offset = 0;
  for (const line of markdown.split("\n")) {
    const marker = fencePattern.exec(line)?.[1];
    if (marker) {
      if (!fence) fence = marker;
      else if (marker[0] === fence[0] && marker.length >= fence.length) {
        fence = null;
        fenceEnd = offset + line.length;
      }
    }
    offset += line.length + 1;
  }
  if (fence) return `${markdown}${markdown.endsWith("\n") ? "" : "\n"}${fence}`;

  const head = markdown.slice(0, fenceEnd);
  let tail = markdown.slice(fenceEnd);
  tail = tail.replace(/\[([^\]\n]*)\]\([^)\s]*$/, "$1");

  const ticks = (tail.match(/`/g) ?? []).length;
  // A lone trailing backtick has no content yet; closing it would print ``.
  if (ticks % 2 === 1)
    tail = tail.endsWith("`") ? tail.slice(0, -1) : `${tail}\``;
  // Pairs are counted outside inline code, where asterisks are literal.
  const prose = tail.replace(/`[^`]*`/g, "");
  if ((prose.match(/\*\*/g) ?? []).length % 2 === 1) {
    tail = tail.replace(/\*\*\s*$/, "");
    if ((tail.replace(/`[^`]*`/g, "").match(/\*\*/g) ?? []).length % 2 === 1)
      tail += "**";
  }
  if ((prose.match(/~~/g) ?? []).length % 2 === 1) tail += "~~";
  return head + tail;
}
