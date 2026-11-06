import { Combobox, type ComboboxRootProps } from "./combobox";
import { Dialog } from "./dialog";
export interface CommandRootProps<
  Value,
  Multiple extends boolean | undefined = false,
  Item = Value,
> extends ComboboxRootProps<Value, Multiple, Item> {
  /** Keep the command list inline. @default true */ inline?: boolean;
  /** Controlled visibility; defaults to true for the inline command list. */ open?: boolean;
  /** Highlight the first matching command. @default true */ autoHighlight?: boolean;
}
/** Commands keep their inline list logically open; Base UI owns filtering and activation. */
function CommandRoot<
  Value,
  Multiple extends boolean | undefined = false,
  Item = Value,
>({
  inline = true,
  open,
  autoHighlight = true,
  ...props
}: CommandRootProps<Value, Multiple, Item>) {
  return (
    <Combobox.Root
      {...props}
      inline={inline}
      open={open ?? (inline ? true : undefined)}
      autoHighlight={autoHighlight}
    />
  );
}
/** Dialog parts are optional modal composition; no second focus manager is added. */
export const Command: {
  Root: typeof Combobox.Root;
  Input: typeof Combobox.Input;
  List: typeof Combobox.List;
  Item: typeof Combobox.Item;
  Empty: typeof Combobox.Empty;
  Group: typeof Combobox.Group;
  GroupLabel: typeof Combobox.GroupLabel;
  Collection: typeof Combobox.Collection;
  Dialog: typeof Dialog;
} = /* @__PURE__ */ (() => ({
  Root: CommandRoot,
  Input: Combobox.Input,
  List: Combobox.List,
  Item: Combobox.Item,
  Empty: Combobox.Empty,
  Group: Combobox.Group,
  GroupLabel: Combobox.GroupLabel,
  Collection: Combobox.Collection,
  Dialog,
}))();
