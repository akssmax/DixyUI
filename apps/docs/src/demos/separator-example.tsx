import { Separator, Stack, Text } from "@dixy-ui/react";

export default function SeparatorExample({
  emphasis = "subtle",

  orientation = "horizontal",
}: {
  emphasis?: "subtle" | "strong";

  orientation?: "horizontal" | "vertical";
}) {
  return (
    <Stack gap="md" style={{ width: "min(100%, 22rem)" }}>
      <Text>Design</Text>
      <Separator emphasis={emphasis} orientation={orientation} />
      <Text>Engineering</Text>
    </Stack>
  );
}
