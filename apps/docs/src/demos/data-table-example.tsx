import { useState } from "react";
import { DataTable, Stack } from "@dixy-ui/react";
import type { VisualProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function DataTableExample({
  size = "md",
  variant = "outline",
  color = "accent",
  radius,
  material,
}: VisualProps) {
  const visual = { size };
  const [sort, setSort] = useState<{
    column: string | number;
    direction: "ascending" | "descending";
  }>({ column: "members", direction: "ascending" });
  const rows = [
    { id: 1, name: "Personal", members: 1 },
    { id: 2, name: "Team", members: 8 },
    { id: 3, name: "Studio", members: 4 },
  ].sort((a, b) => {
    const result =
      sort.column === "name"
        ? a.name.localeCompare(b.name)
        : a.members - b.members;
    return sort.direction === "ascending" ? result : -result;
  });
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <DataTable.Root
        {...visual}
        aria-label="Workspace plans"
        sortDescriptor={sort}
        onSortChange={setSort}
      >
        <DataTable.Header>
          <DataTable.Column id="name" isRowHeader allowsSorting>
            Plan
          </DataTable.Column>
          <DataTable.Column id="members" allowsSorting>
            Members
          </DataTable.Column>
        </DataTable.Header>
        <DataTable.Body items={rows}>
          {(row) => (
            <DataTable.Row id={row.id}>
              <DataTable.Cell>{row.name}</DataTable.Cell>
              <DataTable.Cell>{row.members}</DataTable.Cell>
            </DataTable.Row>
          )}
        </DataTable.Body>
      </DataTable.Root>
    </Stack>
  );
}
