import type { SVGProps } from "react";

/** Small decorative glyphs for built-in affordances. They inherit currentColor
 * and the control's icon size; consumers can replace them through children. */
function Glyph({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className="dixy-glyph"
      {...props}
    >
      {children}
    </svg>
  );
}
export const CopyGlyph = () => (
  <Glyph>
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
  </Glyph>
);
export const CheckGlyph = () => (
  <Glyph>
    <path d="M20 6 9 17l-5-5" />
  </Glyph>
);
export const EyeGlyph = () => (
  <Glyph>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </Glyph>
);
export const EyeOffGlyph = () => (
  <Glyph>
    <path d="M10.6 5.1A9.8 9.8 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-2.2 3.2" />
    <path d="M6.6 6.6C3.8 8.4 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    <path d="m2 2 20 20" />
  </Glyph>
);
export const MenuGlyph = () => (
  <Glyph>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Glyph>
);
export const CloseGlyph = () => (
  <Glyph>
    <path d="M18 6 6 18M6 6l12 12" />
  </Glyph>
);
export const ArrowUpGlyph = () => (
  <Glyph>
    <path d="M12 19V5M5 12l7-7 7 7" />
  </Glyph>
);
export const ArrowDownGlyph = () => (
  <Glyph>
    <path d="M12 5v14M19 12l-7 7-7-7" />
  </Glyph>
);
export const StopGlyph = () => (
  <Glyph>
    <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" />
  </Glyph>
);
export const ChevronDownGlyph = () => (
  <Glyph>
    <path d="m6 9 6 6 6-6" />
  </Glyph>
);
/** A lightbulb, for visible reasoning. Radiating lines read as a spinner. */
export const SparkGlyph = () => (
  <Glyph>
    <path d="M9 18h6M10 21h4" />
    <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.9V16h5v-.2c0-.8.4-1.5 1-1.9A6 6 0 0 0 12 3Z" />
  </Glyph>
);
export const WrenchGlyph = () => (
  <Glyph>
    <path d="M14.7 6.3a4 4 0 0 0 5 5l-8.4 8.4a2.1 2.1 0 0 1-3-3l8.4-8.4a4 4 0 0 0-2-2Z" />
    <path d="M14.7 6.3 17 4" />
  </Glyph>
);
export const LinkGlyph = () => (
  <Glyph>
    <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
    <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
  </Glyph>
);
