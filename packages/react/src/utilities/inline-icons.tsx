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
