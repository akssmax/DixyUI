import { createElement, type ComponentType, type ReactNode } from "react";
import { ThemeScope, useThemeSettings } from "../theme/theme";
import { withClassName } from "./class-name";

type StyleProps = {
  className?: string | ((state: unknown) => string | undefined);
};

/** Preserve the primitive's exact public type, including generic value types.
 * React 19 forwards ref as a prop; no extra DOM node or event handler is added.
 */
export function styledPrimitive<T>(primitive: T, className: string): T {
  function Styled(props: StyleProps) {
    const theme = useThemeSettings();
    return createElement(primitive as ComponentType<StyleProps>, {
      ...props,
      ...({ "data-dixy-skin": theme.skin?.id } as {}),
      className: withClassName(className, props.className),
    });
  }
  Styled.displayName = className;
  return Styled as T;
}

/** React context crosses portals; this scope restores CSS token inheritance. */
export function themedPortal<T>(primitive: T): T {
  function Portal({ children, ...props }: { children?: ReactNode }) {
    return createElement(
      primitive as ComponentType<{ children?: ReactNode }>,
      props,
      <ThemeScope>{children}</ThemeScope>,
    );
  }
  return Portal as T;
}
