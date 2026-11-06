import { Tabs, type TabsRootProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";

type Props = Pick<
  TabsRootProps,
  | "size"
  | "variant"
  | "color"
  | "radius"
  | "material"
  | "align"
  | "orientation"
  | "fullWidth"
> & {
  disabled?: boolean;
  icons?: boolean;
  activateOnFocus?: boolean;
};

export default function TabsExample({
  size = "md",
  variant = "line",
  color = "accent",
  radius,
  material,
  align = "center",
  orientation = "horizontal",
  fullWidth = false,
  disabled = false,
  icons = false,
  activateOnFocus = false,
}: Props) {
  return (
    <Tabs.Root
      defaultValue="overview"
      size={size}
      variant={variant}
      color={color}
      radius={radius}
      material={material}
      align={align}
      orientation={orientation}
      fullWidth={fullWidth}
      style={{ width: "min(100%, 30rem)" }}
    >
      <Tabs.List
        aria-label="Project information"
        activateOnFocus={activateOnFocus}
      >
        <Tabs.Tab value="overview">
          {icons && (
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <rect x="2.5" y="2.5" width="11" height="11" rx="2" />
              <path d="M2.5 6.5h11M6.5 6.5v7" />
            </svg>
          )}
          Overview
        </Tabs.Tab>
        <Tabs.Tab value="activity" disabled={disabled}>
          {icons && (
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M1 8h3l2-5 4 10 2-5h3" />
            </svg>
          )}
          Activity
        </Tabs.Tab>
        <Tabs.Tab value="settings">
          {icons && (
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M3 4h10M3 8h10M3 12h10" />
              <circle cx="6" cy="4" r="1.5" />
              <circle cx="10" cy="8" r="1.5" />
              <circle cx="6" cy="12" r="1.5" />
            </svg>
          )}
          Settings
        </Tabs.Tab>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Panel value="overview">
        A calm place to plan your next project.
      </Tabs.Panel>
      <Tabs.Panel value="activity">
        Your latest project changes appear here.
      </Tabs.Panel>
      <Tabs.Panel value="settings">Manage your project preferences.</Tabs.Panel>
    </Tabs.Root>
  );
}
