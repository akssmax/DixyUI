import { useState } from "react";
import { Item, Link, Pagination, Stack, Text } from "@dixy-ui/react";
import type { VisualProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function PaginationExample({
  size = "md",
  variant = "outline",
  color = "accent",
  radius,
  material,
}: VisualProps) {
  const visual = { size, radius };
  const [current, setCurrent] = useState(1);
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <Pagination.Root {...visual}>
        <Pagination.List>
          {[1, 2, 3].map((page) => (
            <Pagination.Item key={page}>
              <Pagination.Link
                href={`#page-${page}`}
                aria-label={`Page ${page}`}
                aria-current={page === current ? "page" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  setCurrent(page);
                }}
              >
                {page}
              </Pagination.Link>
            </Pagination.Item>
          ))}
        </Pagination.List>
        <Text role="status">Page {current} of 3</Text>
      </Pagination.Root>
    </Stack>
  );
}
