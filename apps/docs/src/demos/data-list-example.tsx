import { Badge, Code, DataList, User } from "@dixy-ui/react";

export default function DataListExample({
  orientation = "horizontal",
  size = "md",
}: {
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
}) {
  return (
    <DataList.Root
      orientation={orientation}
      size={size}
      style={{ width: "min(100%, 26rem)" }}
    >
      <DataList.Item>
        <DataList.Label>Status</DataList.Label>
        <DataList.Value>
          <Badge variant="soft" color="success" size="sm">
            Published
          </Badge>
        </DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label>Package</DataList.Label>
        <DataList.Value>
          <Code>@dixy-ui/react</Code>
        </DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label>Owner</DataList.Label>
        <DataList.Value>
          <User name="Akshay Saini" size="sm" />
        </DataList.Value>
      </DataList.Item>
    </DataList.Root>
  );
}
