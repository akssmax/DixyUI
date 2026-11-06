import {
  Breadcrumbs as Root,
  Breadcrumb as Item,
} from "react-aria-components/Breadcrumbs";
import { Link } from "./link";
import { styledPrimitive } from "../utilities/styled-primitive";
export const Breadcrumbs = /* @__PURE__ */ (() => ({
  Root: /* @__PURE__ */ styledPrimitive(Root, "dixy-breadcrumbs"),
  Item: /* @__PURE__ */ styledPrimitive(Item, "dixy-breadcrumb"),
  Link,
}))();
