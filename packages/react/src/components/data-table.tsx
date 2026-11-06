import * as Primitive from "react-aria-components/Table";

import type { VisualProps } from "../utilities/native-part";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { styledPrimitive } from "../utilities/styled-primitive";
export interface DataTableRootProps
  extends
    Omit<Primitive.TableProps, keyof VisualProps>,
    Pick<VisualProps, "size"> {}
function Root({ size, className, ...props }: DataTableRootProps) {
  const visual = useComponentVisuals({
    size,
  });
  return (
    <Primitive.Table
      {...props}
      {...visual}
      className={withClassName("dixy-aria-root dixy-data-table", className)}
    />
  );
}
export const DataTable = /* @__PURE__ */ (() => ({
  Root,
  Header: /* @__PURE__ */ styledPrimitive(
    Primitive.TableHeader,
    "dixy-aria-tableheader",
  ),
  Body: /* @__PURE__ */ styledPrimitive(
    Primitive.TableBody,
    "dixy-aria-tablebody",
  ),
  Footer: /* @__PURE__ */ styledPrimitive(
    Primitive.TableFooter,
    "dixy-aria-tablefooter",
  ),
  Column: /* @__PURE__ */ styledPrimitive(Primitive.Column, "dixy-aria-column"),
  Row: /* @__PURE__ */ styledPrimitive(Primitive.Row, "dixy-aria-row"),
  Cell: /* @__PURE__ */ styledPrimitive(Primitive.Cell, "dixy-aria-cell"),
  Checkbox: /* @__PURE__ */ styledPrimitive(
    Primitive.Checkbox,
    "dixy-aria-checkbox",
  ),
  ResizeContainer: /* @__PURE__ */ styledPrimitive(
    Primitive.ResizableTableContainer,
    "dixy-aria-resizabletablecontainer",
  ),
  ColumnResizer: /* @__PURE__ */ styledPrimitive(
    Primitive.ColumnResizer,
    "dixy-aria-columnresizer",
  ),
}))();
