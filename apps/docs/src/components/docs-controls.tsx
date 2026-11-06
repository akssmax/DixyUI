import {
  Children,
  isValidElement,
  type ReactNode,
  type ComponentProps,
} from "react";
import {
  Collapsible,
  Select,
  Slider,
  Switch,
  type SwitchRootProps,
} from "@dixy-ui/react";

type Option = { value: string; label: ReactNode; disabled?: boolean };
function optionsFrom(children: ReactNode): Option[] {
  return Children.toArray(children).flatMap((child) => {
    if (
      !isValidElement<{
        value?: string | number;
        children?: ReactNode;
        disabled?: boolean;
      }>(child)
    )
      return [];
    if (child.type === "option")
      return [
        {
          value: String(child.props.value ?? child.props.children ?? ""),
          label: child.props.children,
          disabled: child.props.disabled,
        },
      ];
    return optionsFrom(child.props.children);
  });
}
/** Docs-only data adapter: existing option declarations feed the public compound Select. */
export function DocsSelect({
  children,
  value,
  onValueChange,
  disabled,
  name,
  required,
  id,
  className,
  style,
  ...props
}: Pick<
  ComponentProps<"button">,
  | "aria-label"
  | "aria-labelledby"
  | "aria-describedby"
  | "id"
  | "title"
  | "className"
  | "style"
  | "disabled"
  | "name"
> & {
  children?: ReactNode;
  required?: boolean;
  value?: string | number;
  onValueChange: (value: string) => void;
}) {
  const options = optionsFrom(children);
  return (
    <Select.Root
      items={options}
      value={String(value ?? "")}
      onValueChange={(next) => onValueChange(next ?? "")}
      disabled={disabled}
      name={name}
      required={required}
    >
      <Select.Trigger
        {...props}
        id={id}
        size="sm"
        className={className ? `docs-select ${className}` : "docs-select"}
        style={style}
      >
        <Select.Value />
        <Select.Icon />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner sideOffset={4} alignItemWithTrigger={false}>
          <Select.Popup size="sm" className="docs-select-popup">
            <Select.List>
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  <Select.ItemText>{option.label}</Select.ItemText>
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}

export function DocsSwitch(props: SwitchRootProps) {
  return (
    <Switch.Root size="sm" color="neutral" {...props}>
      <Switch.Thumb />
    </Switch.Root>
  );
}

export function DocsSlider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  id,
  "aria-label": label,
}: {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange: (value: string) => void;
  id?: string;
  "aria-label": string;
}) {
  return (
    <Slider.Root
      id={id}
      value={value}
      min={min}
      max={max}
      step={step}
      onValueChange={(next) => onValueChange(String(next))}
      size="sm"
      className="docs-slider"
    >
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
        </Slider.Track>
        <Slider.Thumb aria-label={label} />
      </Slider.Control>
    </Slider.Root>
  );
}

export function DocsDisclosure({
  summary,
  children,
  ...props
}: Omit<ComponentProps<typeof Collapsible.Root>, "children"> & {
  summary: ReactNode;
  children: ReactNode;
}) {
  return (
    <Collapsible.Root {...props}>
      <Collapsible.Trigger className="docs-disclosure-trigger">
        {summary}
      </Collapsible.Trigger>
      <Collapsible.Panel>{children}</Collapsible.Panel>
    </Collapsible.Root>
  );
}
