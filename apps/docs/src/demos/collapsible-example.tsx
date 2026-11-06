import { Collapsible, Stack } from "@dixy-ui/react";
import type { CollapsibleRootProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";

type Props = Pick<CollapsibleRootProps, "size" | "variant" | "radius"> & {
  disabled?: boolean;
};

export default function CollapsibleExample({
  size = "md",
  variant = "plain",
  radius,
  disabled = false,
}: Props) {
  return (
    <Stack gap="md" style={{ width: "min(100%, 22rem)" }}>
      <Collapsible.Root
        size={size}
        variant={variant}
        radius={radius}
        disabled={disabled}
      >
        <Collapsible.Trigger>
          Project details
          <svg
            data-dixy-chevron=""
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="m4 6 4 4 4-4" />
          </svg>
        </Collapsible.Trigger>
        <Collapsible.Panel>
          <p>This project uses Dixy tokens and Base UI behavior.</p>
        </Collapsible.Panel>
      </Collapsible.Root>
    </Stack>
  );
}
