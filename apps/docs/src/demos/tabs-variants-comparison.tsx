import { Tabs, Stack, Text } from "@dixy-ui/react";
export default function TabsVariantsComparison() {
  return (
    <Stack gap="lg" style={{ width: "min(100%, 30rem)" }}>
      {(["line", "solid", "soft", "outline", "segmented"] as const).map(
        (value) => (
          <div key={value}>
            <Text variant="body.sm">{value}</Text>
            <Tabs.Root defaultValue="overview" variant={value} fullWidth>
              <Tabs.List aria-label={`${value} tabs`}>
                <Tabs.Tab value="overview">Overview</Tabs.Tab>
                <Tabs.Tab value="activity">Activity</Tabs.Tab>
                <Tabs.Tab value="settings">Settings</Tabs.Tab>
                <Tabs.Indicator />
              </Tabs.List>
              <Tabs.Panel value="overview">Project overview.</Tabs.Panel>
              <Tabs.Panel value="activity">Recent project activity.</Tabs.Panel>
              <Tabs.Panel value="settings">Project preferences.</Tabs.Panel>
            </Tabs.Root>
          </div>
        ),
      )}
    </Stack>
  );
}
