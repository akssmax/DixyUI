import type { ComponentProps, ComponentPropsWithRef } from "react";
import { Button } from "../components/button";

export interface SuggestionsRootProps extends ComponentPropsWithRef<"ul"> {
  /** Accessible name of the list. @default Suggestions */
  "aria-label"?: string;
}

function Root({
  className,
  "aria-label": label = "Suggestions",
  ...props
}: SuggestionsRootProps) {
  return (
    <ul
      {...props}
      aria-label={label}
      className={["dixy-suggestions", className].filter(Boolean).join(" ")}
    />
  );
}

export interface SuggestionItemProps extends Omit<
  ComponentProps<typeof Button>,
  "onClick" | "children" | "onSelect"
> {
  /** The prompt this suggestion sends. Also its label unless children are given. */
  suggestion: string;
  /** Called with the suggestion when chosen. */
  onSelect?: (suggestion: string) => void;
  children?: ComponentProps<typeof Button>["children"];
}

function Item({
  suggestion,
  onSelect,
  children,
  className,
  ...props
}: SuggestionItemProps) {
  return (
    <li className="dixy-suggestions-item">
      <Button
        type="button"
        variant="outline"
        color="neutral"
        size="sm"
        {...props}
        className={["dixy-suggestion", className].filter(Boolean).join(" ")}
        onClick={() => onSelect?.(suggestion)}
      >
        {children ?? suggestion}
      </Button>
    </li>
  );
}

/** Starter prompts: a wrapping list of buttons that each send a prompt. */
export const Suggestions = /* @__PURE__ */ (() => ({ Root, Item }))();
