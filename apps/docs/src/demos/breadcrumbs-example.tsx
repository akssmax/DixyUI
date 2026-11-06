import { Item, Link, Breadcrumbs, Stack } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function BreadcrumbsExample({
  state = "enabled",
}: {
  state?: "enabled" | "disabled";
}) {
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <Breadcrumbs.Root aria-label="Breadcrumb">
        <Breadcrumbs.Item>
          <Breadcrumbs.Link
            isDisabled={state === "disabled"}
            href="#playground"
          >
            Workspace
          </Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link isDisabled={state === "disabled"} href="#examples">
            Components
          </Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link>Overview</Breadcrumbs.Link>
        </Breadcrumbs.Item>
      </Breadcrumbs.Root>
    </Stack>
  );
}
