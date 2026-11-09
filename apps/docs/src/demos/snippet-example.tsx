import { Snippet, Stack } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";

export default function SnippetExample({
  variant = "soft",
  color = "neutral",
  size = "md",
  radius,
  material,
  symbol = true,
  hideCopyButton = false,
}: {
  variant?: "soft" | "outline" | "solid";
  color?: "accent" | "neutral" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  material?: "matte" | "glossy" | "soft" | "metal" | "paper";
  symbol?: boolean;
  hideCopyButton?: boolean;
}) {
  const visual = { variant, color, size, radius, material, hideCopyButton };
  return (
    <Stack gap="md" style={{ width: "min(100%, 28rem)" }}>
      <Snippet {...visual} symbol={symbol ? "$" : undefined}>
        pnpm add @dixy-ui/react
      </Snippet>
      <Snippet {...visual} symbol={symbol ? "$" : undefined}>
        {"pnpm install\npnpm dev"}
      </Snippet>
    </Stack>
  );
}
