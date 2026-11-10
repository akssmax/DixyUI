import { Stack } from "@dixy-ui/react";
import { Loader, Shimmer } from "@dixy-ui/react/ai";
import "@dixy-ui/react/ai.css";

export default function ShimmerExample({
  speed = "normal",
}: {
  speed?: "fast" | "normal" | "slow";
}) {
  const duration = { fast: 1, normal: 2, slow: 4 }[speed];
  return (
    <Stack gap="md" style={{ alignItems: "flex-start" }}>
      <Shimmer duration={duration}>Thinking…</Shimmer>
      <Shimmer as="p" duration={duration} style={{ margin: 0 }}>
        Searching three sources
      </Shimmer>
      <Loader label="Waiting for the reply" />
    </Stack>
  );
}
