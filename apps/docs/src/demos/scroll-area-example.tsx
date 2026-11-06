import { ScrollArea, Stack } from "@dixy-ui/react";
import type { ScrollAreaRootProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";

type Props = Pick<ScrollAreaRootProps, "size" | "variant" | "radius"> & {
  horizontal?: boolean;
  long?: boolean;
};

export default function ScrollAreaExample({
  horizontal = false,
  size = "md",
  variant = "plain",
  radius,
  long = true,
}: Props) {
  return (
    <Stack gap="md" style={{ width: "min(100%, 22rem)" }}>
      <ScrollArea.Root
        size={size}
        variant={variant}
        radius={radius}
        style={{
          height: "12rem",
        }}
      >
        <ScrollArea.Viewport tabIndex={0} aria-label="Project activity">
          <ScrollArea.Content
            style={{
              padding: "var(--dixy-spacing-inset-md)",
              minWidth: horizontal ? "32rem" : undefined,
            }}
          >
            {Array.from({ length: long ? 16 : 3 }, (_, i) => (
              <p key={i}>Project milestone {i + 1}</p>
            ))}
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar>
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
        {horizontal && (
          <ScrollArea.Scrollbar orientation="horizontal">
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>
        )}
        <ScrollArea.Corner />
      </ScrollArea.Root>
    </Stack>
  );
}
