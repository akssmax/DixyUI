/*
 * Foundation page titles and copy. Kept apart from foundation-page.tsx because
 * the route's loader and head read them, and route options are not code
 * split: importing them from the page pulled every foundation component into
 * the entry chunk.
 */
export const foundationPages = {
  theming: {
    title: "Theming",
    deck: "One foundation. Your own character.",
    description:
      "Appearance, accent, and radius belong to the theme. Components consume semantic tokens so the whole interface changes together.",
  },
  color: {
    title: "Color",
    deck: "A little color. A clear purpose.",
    description:
      "Semantic color names describe a role, not a particular shade. A border stays a border when the appearance changes.",
  },
  icons: {
    title: "Icons",
    deck: "Different shapes. A shared language.",
    description:
      "Bring your own SVG icons, keep their personality, and share Dixy’s sizing, semantic colors and accessibility contract.",
  },
  typography: {
    title: "Typography",
    deck: "A system with something to say.",
    description:
      "Semantic roles give every word a purpose. Inter Variable keeps reading comfortable; Space Grotesk Variable gives display text its character.",
  },
  spacing: {
    title: "Spacing",
    deck: "Give the details room to breathe.",
    description:
      "Numeric primitives set the rhythm. Semantic relationships and density give each layout the room it needs.",
  },
  "sizing-layout": {
    title: "Sizing & layout",
    deck: "Fit the content. Reach the controls.",
    description:
      "Independent size contracts keep controls predictable while containers, viewport thresholds, and gutters make layouts adapt.",
  },
  surfaces: {
    title: "Radius, borders & shadows",
    deck: "Quiet structure. Clear depth.",
    description:
      "Contextual corners, semantic edges and restrained depth connect the controls to the surfaces around them.",
  },
  materials: {
    title: "Materials",
    deck: "A finish with a purpose.",
    description:
      "Static finishes bring tactile character to controls and surfaces, with optional styles and explicit effects reduction.",
  },
  shape: {
    title: "Shape",
    deck: "Give geometry a role.",
    description:
      "Semantic silhouettes connect controls and containers. Decorative artwork keeps clear of content and focus.",
  },
  emotion: {
    title: "Emotion",
    deck: "A consistent character.",
    description:
      "Coordinated personality presets connect finish, geometry, and response without changing what an action means.",
  },
  haptics: {
    title: "Haptics",
    deck: "Feedback you can choose.",
    description:
      "Meaningful events, optional device adapters, and visual feedback that always stands on its own.",
  },
  motion: {
    title: "Motion",
    deck: "Enough movement to make sense.",
    description:
      "Fast feedback for controls. A measured transition for overlays. Motion explains a change, then gets out of the way.",
  },
};
export type FoundationSlug = keyof typeof foundationPages;
