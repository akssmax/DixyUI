import { useState } from "react";
import { Button, type ButtonProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";

interface ButtonExampleProps extends Pick<
  ButtonProps,
  "size" | "variant" | "color" | "disabled" | "loading" | "material" | "shape"
> {}

export default function ButtonExample({
  size = "md",
  variant = "solid",
  color = "accent",
  disabled = false,
  loading = false,
  material,
  shape,
}: ButtonExampleProps) {
  const [count, setCount] = useState(0);
  return (
    <div style={{ display: "grid", justifyItems: "center", gap: 14 }}>
      <Button
        material={material}
        shape={shape}
        size={size}
        variant={variant}
        color={color}
        disabled={disabled}
        loading={loading}
        onClick={() => setCount((value) => value + 1)}
      >
        Create project <span aria-hidden="true">↗</span>
      </Button>
      <span
        style={{
          font: "var(--dixy-font-body-sm)",
          letterSpacing: "var(--dixy-font-body-sm-letter-spacing)",
          color: "var(--dixy-text-muted)",
          textAlign: "center",
        }}
        role="status"
      >
        {count > 0
          ? `Activated ${count} ${count === 1 ? "time" : "times"}`
          : "A good place to begin."}
      </span>
    </div>
  );
}
