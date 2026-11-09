import { Card, Grid } from "@dixy-ui/react";

const tiles = ["Tokens", "Themes", "Skins", "Motion", "Materials", "Docs"];

export default function GridExample({
  layout = "responsive",
  columns = "3",
  gap = "md",
}: {
  layout?: "responsive" | "fixed";
  columns?: string;
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
}) {
  return (
    <Grid
      gap={gap}
      columns={Number(columns)}
      minColumnWidth={layout === "responsive" ? "9rem" : undefined}
      style={{ width: "min(100%, 34rem)" }}
    >
      {tiles.map((tile) => (
        <Card.Root key={tile} size="sm">
          <Card.Title>{tile}</Card.Title>
        </Card.Root>
      ))}
    </Grid>
  );
}
