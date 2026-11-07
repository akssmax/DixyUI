import { useCallback, useState, type Ref, type SyntheticEvent } from "react";
import { nativePart, type NativePartProps } from "../utilities/native-part";

export interface ImageProps extends NativePartProps<"img", "radius"> {
  /** Required. Describe the image, or pass "" when it is purely decorative. */
  alt: string;
  /** Shown once if src fails to load. */
  fallbackSrc?: string;
  /** Show a subtle surface until the image has loaded. @default true */
  placeholder?: boolean;
  /** Native lazy loading. @default lazy */
  loading?: "lazy" | "eager";
}

const Img = /* @__PURE__ */ nativePart("img", "dixy-image", [
  "radius",
] as const);

type Status = "loading" | "loaded" | "error";

/** A native img with a loading surface, one fallback source and a gentle,
 * reduced-motion-aware reveal. data-status exposes loading/loaded/error. */
export function Image({
  src,
  fallbackSrc,
  placeholder = true,
  loading = "lazy",
  onLoad,
  onError,
  ref,
  ...props
}: ImageProps) {
  // Reset during render when src changes; an effect could race a cached load.
  const [state, setState] = useState<{
    src: typeof src;
    status: Status;
    fallback: boolean;
  }>({ src, status: "loading", fallback: false });
  if (state.src !== src) setState({ src, status: "loading", fallback: false });
  const current = state.fallback ? fallbackSrc : src;

  // Images that finished before hydration never fire onLoad in React.
  const observe = useCallback(
    (node: HTMLImageElement | null) => {
      if (node?.complete && node.currentSrc) {
        setState((previous) =>
          previous.status === "loading"
            ? {
                ...previous,
                status: node.naturalWidth > 0 ? "loaded" : previous.status,
              }
            : previous,
        );
      }
      if (typeof ref === "function") return ref(node);
      if (ref) (ref as { current: HTMLImageElement | null }).current = node;
    },
    [ref],
  );

  return (
    <Img
      {...props}
      ref={observe as Ref<HTMLImageElement>}
      src={current}
      loading={loading}
      data-status={state.status}
      data-placeholder={placeholder ? "" : undefined}
      onLoad={(event: SyntheticEvent<HTMLImageElement>) => {
        setState((previous) => ({ ...previous, status: "loaded" }));
        onLoad?.(event);
      }}
      onError={(event: SyntheticEvent<HTMLImageElement>) => {
        setState((previous) =>
          fallbackSrc && !previous.fallback
            ? { ...previous, fallback: true, status: "loading" }
            : { ...previous, status: "error" },
        );
        onError?.(event);
      }}
    />
  );
}
