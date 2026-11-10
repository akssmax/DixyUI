import { Collapsible } from "@base-ui/react/collapsible";
import type { ComponentProps, ComponentPropsWithRef, ReactNode } from "react";
import { ChevronDownGlyph, LinkGlyph } from "../utilities/inline-icons";

function Root({
  className,
  ...props
}: ComponentProps<typeof Collapsible.Root>) {
  return (
    <Collapsible.Root
      {...props}
      className={["dixy-sources", className].filter(Boolean).join(" ")}
    />
  );
}

export interface SourcesTriggerProps extends Omit<
  ComponentProps<typeof Collapsible.Trigger>,
  "children"
> {
  /** How many sources the reply used. */
  count: number;
  /** Replace the label. @default "Used N sources" */
  children?: ReactNode;
}

function Trigger({
  count,
  children,
  className,
  ...props
}: SourcesTriggerProps) {
  return (
    <Collapsible.Trigger
      {...props}
      className={["dixy-sources-trigger", className].filter(Boolean).join(" ")}
    >
      <span>{children ?? `Used ${count} source${count === 1 ? "" : "s"}`}</span>
      <span className="dixy-sources-chevron" aria-hidden="true">
        <ChevronDownGlyph />
      </span>
    </Collapsible.Trigger>
  );
}

function Content({
  className,
  children,
  ...props
}: ComponentProps<typeof Collapsible.Panel>) {
  return (
    <Collapsible.Panel
      {...props}
      className={["dixy-sources-content", className].filter(Boolean).join(" ")}
    >
      <ul className="dixy-sources-list">{children as ReactNode}</ul>
    </Collapsible.Panel>
  );
}

export interface SourceProps extends Omit<ComponentPropsWithRef<"a">, "title"> {
  /** The link target. */
  href: string;
  /** The page title. Falls back to the host name. */
  title?: ReactNode;
}

const hostOf = (href: string) => {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
};

/** One cited page. Opens in a new tab, which its accessible name says. */
function Source({ href, title, className, ...props }: SourceProps) {
  const host = hostOf(href);
  return (
    <li className="dixy-source-item">
      <a
        target="_blank"
        rel="noreferrer noopener"
        {...props}
        href={href}
        className={["dixy-source", className].filter(Boolean).join(" ")}
      >
        <span className="dixy-source-icon" aria-hidden="true">
          <LinkGlyph />
        </span>
        <span className="dixy-source-text">
          <span className="dixy-source-title">{title ?? host}</span>
          <span className="dixy-source-host">{host}</span>
        </span>
        <span className="dixy-visually-hidden"> (opens in a new tab)</span>
      </a>
    </li>
  );
}

/** The pages a reply drew on, behind a "Used N sources" disclosure. */
export const Sources = /* @__PURE__ */ (() => ({
  Root,
  Trigger,
  Content,
  Source,
}))();
