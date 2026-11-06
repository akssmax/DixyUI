import { Tabs, Stack, Text } from "@dixy-ui/react";

export default function TabsOrientationComparison() {
  return (
    <Stack gap="lg" style={{ width: "min(100%, 30rem)" }}>
      <div>
        <Text variant="body.sm">Horizontal · manual activation</Text>
        <Tabs.Root defaultValue="account" variant="outline">
          <Tabs.List
            aria-label="Manual account settings"
            activateOnFocus={false}
          >
            <Tabs.Tab value="account">Account</Tabs.Tab>
            <Tabs.Tab value="locked" disabled>
              Unavailable
            </Tabs.Tab>
            <Tabs.Tab value="security">Security</Tabs.Tab>
            <Tabs.Indicator />
          </Tabs.List>
          <Tabs.Panel value="account">
            Arrow keys move focus. Press Enter or Space to select. Disabled tabs
            remain discoverable but cannot activate.
          </Tabs.Panel>
          <Tabs.Panel value="security">
            Manual activation is useful when panel content needs time to load.
          </Tabs.Panel>
        </Tabs.Root>
      </div>
      <div>
        <Text variant="body.sm">Vertical · automatic activation</Text>
        <Tabs.Root
          defaultValue="account"
          orientation="vertical"
          align="start"
          variant="soft"
        >
          <Tabs.List aria-label="Automatic account settings" activateOnFocus>
            <Tabs.Tab value="account">Account</Tabs.Tab>
            <Tabs.Tab value="security">Security</Tabs.Tab>
            <Tabs.Tab value="billing">Billing</Tabs.Tab>
            <Tabs.Indicator />
          </Tabs.List>
          <Tabs.Panel value="account">
            Use Up and Down. Automatic activation is appropriate for these
            immediate, local panels.
          </Tabs.Panel>
          <Tabs.Panel value="security">
            Your password and sign-in preferences.
          </Tabs.Panel>
          <Tabs.Panel value="billing">
            Your subscription and payment preferences.
          </Tabs.Panel>
        </Tabs.Root>
      </div>
    </Stack>
  );
}
