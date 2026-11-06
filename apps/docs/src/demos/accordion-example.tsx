import { Accordion, Stack } from "@dixy-ui/react";
import type { AccordionRootProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";

type Props = Pick<AccordionRootProps, "size" | "variant" | "radius"> & {
  disabled?: boolean;
  multiple?: boolean;
};

export default function AccordionExample({
  size = "md",
  variant = "plain",
  radius,
  disabled = false,
  multiple = false,
}: Props) {
  return (
    <Stack gap="md" style={{ width: "min(100%, 22rem)" }}>
      <Accordion.Root
        size={size}
        variant={variant}
        radius={radius}
        multiple={multiple}
        disabled={disabled}
      >
        {["What is Dixy?", "How do themes work?"].map((question, index) => (
          <Accordion.Item key={question} value={index}>
            <Accordion.Header>
              <Accordion.Trigger>
                {question}
                <svg
                  data-dixy-chevron=""
                  aria-hidden="true"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="m4 6 4 4 4-4" />
                </svg>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel>
              <div style={{ padding: "var(--dixy-spacing-inset-md)" }}>
                {index === 0
                  ? "Accessible components, your visual language."
                  : "Semantic tokens follow the nearest Theme."}
              </div>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </Stack>
  );
}
