import { Tabs } from "@dixy-ui/react";

export default function TabsOverflowComparison() {
  const sections = [
    "Overview",
    "Analytics",
    "Reports",
    "Audience",
    "Acquisition",
    "Retention",
    "Settings",
  ];
  return (
    <Tabs.Root
      variant="outline"
      defaultValue="Overview"
      style={{ width: "min(100%, 24rem)" }}
    >
      <Tabs.List aria-label="Scrollable project sections" activateOnFocus>
        {sections.map((value) => (
          <Tabs.Tab key={value} value={value}>
            {value}
          </Tabs.Tab>
        ))}
        <Tabs.Indicator />
      </Tabs.List>
      {sections.map((value) => (
        <Tabs.Panel key={value} value={value}>
          {value} content. Scroll the list or use arrow keys, Home and End to
          reach every tab.
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  );
}
