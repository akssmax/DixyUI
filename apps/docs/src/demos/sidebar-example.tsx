import { Button, Link, Sidebar, Stack, Heading } from "@dixy-ui/react";
import type { VisualProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function SidebarExample({
  size = "md",
  variant = "outline",
  color = "accent",
  radius,
  material,
}: VisualProps) {
  const visual = { size, radius };
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <Sidebar.Root defaultOpen>
        <Sidebar.Trigger render={<Button size={size} variant="outline" />}>
          Workspace navigation
        </Sidebar.Trigger>
        <Sidebar.Panel>
          <Sidebar.Content {...visual}>
            <Sidebar.Header>
              <Heading as="h3" variant="title.sm">
                Dixy studio
              </Heading>
            </Sidebar.Header>
            <Sidebar.Nav aria-label="Workspace">
              <Link href="#playground">Overview</Link>
              <Link href="#examples">Projects</Link>
            </Sidebar.Nav>
          </Sidebar.Content>
        </Sidebar.Panel>
      </Sidebar.Root>
    </Stack>
  );
}
