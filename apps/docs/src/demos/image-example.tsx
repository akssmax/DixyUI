import { Grid, Image, Text, Stack } from "@dixy-ui/react";

const art = (hue: number) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><rect width="320" height="200" fill="hsl(${hue} 60% 70%)"/><circle cx="230" cy="70" r="40" fill="hsl(${hue} 70% 85%)"/><path d="M0 200 120 90l70 70 50-40 80 80Z" fill="hsl(${hue} 45% 45%)"/></svg>`,
  )}`;

export default function ImageExample({
  radius = "md",
  placeholder = true,
  useFallback = true,
}: {
  radius?: "none" | "sm" | "md" | "lg" | "full";
  placeholder?: boolean;
  useFallback?: boolean;
}) {
  return (
    <Grid columns={2} gap="md" style={{ width: "min(100%, 30rem)" }}>
      <Stack gap="xs">
        <Image
          src={art(210)}
          alt="Blue mountains under a pale sun"
          width={320}
          height={200}
          radius={radius}
          placeholder={placeholder}
        />
        <Text variant="caption">Loaded</Text>
      </Stack>
      <Stack gap="xs">
        <Image
          src="/does-not-exist.png"
          fallbackSrc={useFallback ? art(140) : undefined}
          alt="Green hills"
          width={320}
          height={200}
          radius={radius}
          placeholder={placeholder}
        />
        <Text variant="caption">
          {useFallback ? "Broken src → fallback" : "Broken src → error"}
        </Text>
      </Stack>
    </Grid>
  );
}
