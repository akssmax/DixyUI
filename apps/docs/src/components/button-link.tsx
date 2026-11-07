import { Link, type LinkProps } from "@tanstack/react-router";
import { Button, type ButtonProps } from "@dixy-ui/react";
import type { ReactNode } from "react";

type Visual = Pick<ButtonProps, "size" | "variant" | "color" | "className">;

/*
 * A Dixy Button that navigates. Base UI's Button gives a non-native element
 * role="button"; a navigation target must stay a link, so the role is
 * restored. The router Link keeps client-side navigation and preloading.
 */
export function ButtonLink({
  children,
  size,
  variant,
  color,
  className,
  ...link
}: Visual & LinkProps & { children: ReactNode }) {
  return (
    <Button
      size={size}
      variant={variant}
      color={color}
      className={className}
      nativeButton={false}
      role="link"
      render={<Link {...(link as LinkProps)} />}
    >
      {children}
    </Button>
  );
}

/** Same as ButtonLink, for in-page anchors such as "#themes". */
export function ButtonAnchor({
  href,
  children,
  ...visual
}: Visual & { href: string; children: ReactNode }) {
  return (
    <Button
      {...visual}
      nativeButton={false}
      role="link"
      render={<a href={href} />}
    >
      {children}
    </Button>
  );
}
