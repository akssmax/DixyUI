import { Item, ListBox, Stack } from "@dixy-ui/react";
import type { VisualProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function ListBoxExample({
  size = "md",
  variant = "outline",
  color = "accent",
  radius,
  material,
}: VisualProps) {
  const visual = {
    size,
    variant: variant === "soft" ? ("soft" as const) : ("outline" as const),
    radius,
    material,
  };
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <ListBox.Root
        {...visual}
        aria-label="Workspace plan"
        selectionMode="single"
        defaultSelectedKeys={["personal"]}
      >
        {["personal", "team", "enterprise"].map((plan) => (
          <ListBox.Item id={plan} key={plan} textValue={plan}>
            {plan}
          </ListBox.Item>
        ))}
      </ListBox.Root>
    </Stack>
  );
}
