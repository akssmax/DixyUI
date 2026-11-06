import type { ReactNode } from "react";
import { Accordion } from "@dixy-ui/react";
import { ChevronDown } from "lucide-react";

/** Shared inspector composition; Dixy/Base UI owns disclosure and focus state. */
export function ThemeInspectorAccordion({
  children,
  defaultValue,
}: {
  children: ReactNode;
  defaultValue?: string[];
}) {
  return (
    <Accordion.Root
      multiple
      defaultValue={defaultValue}
      size="sm"
      variant="plain"
      className="theme-inspector-accordion"
    >
      {children}
    </Accordion.Root>
  );
}

export function ThemeInspectorSection({
  title,
  value,
  children,
}: {
  title: string;
  value: string;
  children: ReactNode;
}) {
  return (
    <Accordion.Item value={value}>
      <Accordion.Header>
        <Accordion.Trigger>
          <span>{title}</span>
          <ChevronDown size={15} data-dixy-chevron="" aria-hidden="true" />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel>
        <div className="theme-inspector-section-content">{children}</div>
      </Accordion.Panel>
    </Accordion.Item>
  );
}
