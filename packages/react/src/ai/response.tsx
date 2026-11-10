import {
  createElement,
  memo,
  useMemo,
  type ComponentPropsWithRef,
  type ReactNode,
} from "react";
import ReactMarkdown, { type Components, type Options } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Table } from "../components/content";
import { Code, Blockquote } from "../components/typography";
import { CodeBlock } from "./code-block";
import { completeMarkdown, splitMarkdownBlocks } from "./markdown";

type HastNode = {
  type: string;
  value?: string;
  tagName?: string;
  properties?: { className?: unknown };
  children?: HastNode[];
};
const hastText = (node: HastNode | undefined): string =>
  !node
    ? ""
    : node.type === "text"
      ? (node.value ?? "")
      : (node.children ?? []).map(hastText).join("");

function languageOf(node: HastNode | undefined) {
  const names = node?.properties?.className;
  const list = Array.isArray(names) ? names : [];
  const match = list.map(String).find((name) => name.startsWith("language-"));
  return match?.slice("language-".length);
}

function baseComponents(headingOffset: number): Components {
  const heading =
    (level: number) =>
    ({
      node: _node,
      ...props
    }: ComponentPropsWithRef<"h1"> & { node?: unknown }) =>
      createElement(`h${Math.min(6, level + headingOffset)}`, {
        ...props,
        "data-level": level,
        className: "dixy-response-heading",
      });
  return {
    h1: heading(1),
    h2: heading(2),
    h3: heading(3),
    h4: heading(4),
    h5: heading(5),
    h6: heading(6),
    a: ({ node: _node, href, children, ...props }) => {
      const external = !!href && /^https?:\/\//.test(href);
      return (
        <a
          {...props}
          href={href}
          className="dixy-link"
          data-color="accent"
          data-size="md"
          {...(external
            ? { target: "_blank", rel: "noreferrer noopener" }
            : {})}
        >
          {children}
        </a>
      );
    },
    // Block code: the fence's language and raw text feed CodeBlock, so its
    // copy action copies exactly what the model wrote.
    pre: ({ node }) => {
      const code = (node as HastNode | undefined)?.children?.find(
        (child) => child.tagName === "code",
      );
      const text = hastText(code).replace(/\n$/, "");
      return <CodeBlock code={text} language={languageOf(code)} />;
    },
    code: ({ node: _node, className: _className, color: _color, ...props }) => (
      <Code {...props} size="sm" />
    ),
    blockquote: ({ node: _node, color: _color, ...props }) => (
      <Blockquote {...props} size="sm" />
    ),
    table: ({ node: _node, ...props }) => (
      <div
        className="dixy-response-table"
        tabIndex={0}
        role="region"
        aria-label="Table"
      >
        <Table.Root {...props} size="sm" />
      </div>
    ),
    thead: ({ node: _node, ...props }) => <Table.Header {...props} />,
    tbody: ({ node: _node, ...props }) => <Table.Body {...props} />,
    tr: ({ node: _node, ...props }) => <Table.Row {...props} />,
    th: ({ node: _node, ...props }) => <Table.Head {...props} />,
    td: ({ node: _node, ...props }) => <Table.Cell {...props} />,
  };
}

const Block = memo(function Block({
  markdown,
  components,
  remarkPlugins,
}: {
  markdown: string;
  components: Components;
  remarkPlugins: NonNullable<Options["remarkPlugins"]>;
}) {
  return (
    <ReactMarkdown components={components} remarkPlugins={remarkPlugins}>
      {markdown}
    </ReactMarkdown>
  );
});

export interface ResponseProps extends Omit<
  ComponentPropsWithRef<"div">,
  "children"
> {
  /** Markdown from the model, GitHub flavored: tables, task lists,
   * strikethrough and autolinks. Raw HTML is shown as text, never rendered. */
  children: string;
  /** The text is still arriving. Unfinished fences, code and bold are closed
   * for display, and the region reports itself busy. @default false */
  streaming?: boolean;
  /** Levels added to markdown headings so a reply's "# Title" sits below the
   * page's own headings. @default 2 (h1 renders as h3) */
  headingOffset?: number;
  /** Replace how individual elements render; merged over Dixy's mapping. */
  components?: Components;
  /** Extra remark plugins, run after remark-gfm. */
  remarkPlugins?: Options["remarkPlugins"];
  /** Shown while streaming has started but no text has arrived. */
  placeholder?: ReactNode;
}

/** Streaming-safe markdown for model replies, rendered with Dixy
 * typography, code blocks, links and tables. Blocks that have finished
 * arriving are memoized, so each new token re-parses only the last one. */
export function Response({
  children,
  streaming = false,
  headingOffset = 2,
  components,
  remarkPlugins,
  placeholder,
  className,
  ...props
}: ResponseProps) {
  const merged = useMemo(
    () => ({ ...baseComponents(headingOffset), ...components }),
    [headingOffset, components],
  );
  const plugins = useMemo(
    () => [remarkGfm, ...(remarkPlugins ?? [])],
    [remarkPlugins],
  );
  const blocks = useMemo(() => splitMarkdownBlocks(children), [children]);
  return (
    <div
      {...props}
      aria-busy={streaming || undefined}
      data-streaming={streaming || undefined}
      className={["dixy-response", className].filter(Boolean).join(" ")}
    >
      {blocks.length === 0 && streaming ? placeholder : null}
      {blocks.map((block, index) => (
        <Block
          key={index}
          markdown={
            streaming && index === blocks.length - 1
              ? completeMarkdown(block)
              : block
          }
          components={merged}
          remarkPlugins={plugins}
        />
      ))}
    </div>
  );
}
