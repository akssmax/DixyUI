import { Tabs } from "@dixy-ui/react";

export default function TabsIconsComparison() {
  return (
    <Tabs.Root
      variant="soft"
      defaultValue="preview"
      fullWidth
      style={{ width: "min(100%, 30rem)" }}
    >
      <Tabs.List aria-label="Document workspace">
        <Tabs.Tab value="preview">
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M1 8s2-5 7-5 7 5 7 5-2 5-7 5-7-5-7-5Z" />
            <circle cx="8" cy="8" r="2" />
          </svg>
          Preview
        </Tabs.Tab>
        <Tabs.Tab value="code">
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="m5 4-4 4 4 4m6-8 4 4-4 4M9 2 7 14" />
          </svg>
          Code
        </Tabs.Tab>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Panel value="preview">
        Icons supplement the text label. Links and actions belong in this panel.
      </Tabs.Panel>
      <Tabs.Panel value="code">
        Compose SVGs or your icon library inside Tab; keep the artwork
        decorative.
      </Tabs.Panel>
    </Tabs.Root>
  );
}
