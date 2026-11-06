import { Table, Stack } from "@dixy-ui/react";
import type { VisualProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function TableExample({
  size = "md",
  variant = "outline",
  color = "accent",
  radius,
  material,
}: VisualProps) {
  const visual = { size };
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <Table.Root {...visual}>
        <Table.Caption>Workspace plans</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.Head scope="col">Plan</Table.Head>
            <Table.Head scope="col">Members</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {[
            ["Personal", 1],
            ["Team", 8],
          ].map(([plan, members]) => (
            <Table.Row key={plan}>
              <Table.Head scope="row">{plan}</Table.Head>
              <Table.Cell>{members}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Stack>
  );
}
