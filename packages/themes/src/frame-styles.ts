import { isOrganicFrame } from "./organic-settings.ts";
import type { ResolvedThemeRecipe } from "./resolve.ts";
export const framePrefixes = {
  forest: "forest",
  pixel: "retro",
  rails: "signal",
  ceramic: "hardware",
  glass: "prism",
  stitch: "atelier",
  coral: "ocean",
  cushion: "clay",
  deco: "deco",
  chamfer: "titanium",
  halo: "light",
  drafting: "blueprint",
  riso: "riso",
  neon: "neon",
  sumi: "sumi",
  transit: "transit",
  crt: "phosphor",
  panes: "ansi",
  swiss: "swiss",
  azulejo: "azulejo",
  formwork: "brutalist",
  atomic: "atomic",
  hud: "hud",
  hazard: "freighter",
  orbit: "sail",
  rangoli: "diwali",
  papercut: "lunar",
  picado: "picado",
  gulal: "holi",
  knit: "yule",
  liquid: "glass",
} as const;
/** Frame code owns trim/geometry only. It never paints an input or action surface. */
export function frameStyles(m: ResolvedThemeRecipe, theme: string): string {
  if (m.frame === "none") return "";
  const prefix = framePrefixes[m.frame];
  const art = `${theme} .dixy-${prefix}-ornament`;
  const safe = {
    x: Math.max(8, m.parameters.paddingInline - 8),
    top: Math.max(8, m.parameters.paddingTop - 8),
    bottom: Math.max(8, m.parameters.paddingBottom - 8),
  };
  const common = `
    ${art} { position:absolute; inset:0; display:block; pointer-events:none; user-select:none; border-radius:inherit; z-index:1; color:var(--dixy-skin-edge); }
    ${art}:is(.dixy-skin-ornament-card,.dixy-skin-ornament-dialog) {
      clip-path:polygon(evenodd,0 0,100% 0,100% 100%,0 100%,0 0,var(--dixy-skin-frame-safe-inline,${safe.x}px) var(--dixy-skin-frame-safe-top,${safe.top}px),var(--dixy-skin-frame-safe-inline,${safe.x}px) calc(100% - var(--dixy-skin-frame-safe-bottom,${safe.bottom}px)),calc(100% - var(--dixy-skin-frame-safe-inline,${safe.x}px)) calc(100% - var(--dixy-skin-frame-safe-bottom,${safe.bottom}px)),calc(100% - var(--dixy-skin-frame-safe-inline,${safe.x}px)) var(--dixy-skin-frame-safe-top,${safe.top}px),var(--dixy-skin-frame-safe-inline,${safe.x}px) var(--dixy-skin-frame-safe-top,${safe.top}px));
    }
    ${art}.dixy-skin-ornament-theme { z-index:-1; overflow:hidden; }
    ${art} .dixy-skin-definitions { position:absolute; overflow:hidden; }
    ${art} .dixy-skin-control-art { width:100%; height:100%; }
    ${art}.dixy-skin-ornament-switch-thumb { display:grid; place-items:center; inset:2px; }
    ${theme} .dixy-switch-thumb:not([data-checked]) > .dixy-${prefix}-ornament { display:none; }
    ${art} .dixy-skin-fastener { position:absolute; width:11px; height:11px; }
    ${art} .dixy-skin-fastener-tl { top:5px; left:5px; }
    ${art} .dixy-skin-fastener-tr { top:5px; right:5px; }
    ${art} .dixy-skin-fastener-bl { bottom:5px; left:5px; }
    ${art} .dixy-skin-fastener-br { bottom:5px; right:5px; }
    ${art}[data-animated] .dixy-skin-motion { animation:dixy-${prefix}-detail 4s ease-in-out infinite alternate; }
    ${art}[data-motion="reduced"] .dixy-skin-motion { animation:none; }
    ${art} .dixy-frame-corner { position:absolute; width:min(64px,50%); height:min(64px,50%); overflow:visible; }
    ${art} .dixy-frame-corner-tl { left:0; top:0; }
    ${art} .dixy-frame-corner-tr { right:0; top:0; transform:scaleX(-1); }
    ${art} .dixy-frame-corner-bl { left:0; bottom:0; transform:scaleY(-1); }
    ${art} .dixy-frame-corner-br { right:0; bottom:0; transform:scale(-1); }
    @media(prefers-reduced-motion:reduce) { ${art}[data-animated] .dixy-skin-motion { animation:none; } }
    @media(prefers-reduced-transparency:reduce),(prefers-contrast:more),(forced-colors:active) { ${art} { display:none; } }
  `;
  const details = {} as Record<string, string>;
  details.pixel = `      .dixy-retro-inlay { position:absolute; inset:0; border:1px solid #ffffff55; border-bottom-color:#10151e44; border-right-color:#10151e44; }
      @keyframes dixy-retro-detail { from { opacity:.25; } to { opacity:1; } }`;
  details.rails = `      .dixy-signal-rail { position:absolute; top:2px; left:2px; right:2px; height:19px; background:repeating-linear-gradient(0deg,#ffffff16 0 1px,#050a08aa 1px 3px); border:1px solid #030705; box-shadow:inset 0 1px 0 #ffffff22,0 1px 0 #ffffff22; }
      .dixy-signal-meter { position:absolute; bottom:7px; right:21px; width:70px; height:10px; color:var(--dixy-color-background-action-primary); opacity:.8; }
      .dixy-signal-bar { transform-origin:center 13px; animation-delay:var(--dixy-detail-delay)!important; }
      @keyframes dixy-signal-detail { from { transform:scaleY(.4); opacity:.55; } to { transform:scaleY(1); opacity:1; } }`;
  details.ceramic = `      .dixy-hardware-seam { position:absolute; inset:2px; border:1px solid #ffffff55; border-radius:inherit; box-shadow:inset 0 -1px 0 #00000018; }
      .dixy-hardware-registration { position:absolute; bottom:9px; right:21px; width:70px; height:9px; color:var(--dixy-color-text-muted); opacity:.5; }
      @keyframes dixy-hardware-detail { from { opacity:.2; } to { opacity:1; } }`;
  details.glass = `      .dixy-prism-atmosphere { width:100%; height:100%; opacity:.9; }
      .dixy-prism-caustic { position:absolute; top:-1px; left:12%; width:42%; height:1px; background:linear-gradient(90deg,transparent,#edf6ff,transparent); box-shadow:0 0 6px 1px #92c9ff77; }
      .dixy-prism-facet { position:absolute; bottom:0; right:0; width:32px; height:32px; border-bottom-right-radius:inherit; opacity:.25; }
      @keyframes dixy-prism-detail { from { transform:translateX(-2%); opacity:.65; } to { transform:translateX(2%); opacity:1; } }`;
  details.stitch = `      .dixy-atelier-linen { display:block; }
      .dixy-atelier-paper { position:absolute; inset:0; border-radius:inherit; overflow:hidden; mix-blend-mode:multiply; }
      .dixy-atelier-wood { position:absolute; }
      .dixy-atelier-wood-top,.dixy-atelier-wood-bottom { left:calc(1px - var(--dixy-skin-frame-width)); width:calc(100% + 2 * var(--dixy-skin-frame-width) - 2px); height:var(--dixy-skin-frame-width); }
      .dixy-atelier-wood-top { top:calc(1px - var(--dixy-skin-frame-width)); border-radius:10px 10px 0 0; }
      .dixy-atelier-wood-bottom { bottom:calc(1px - var(--dixy-skin-frame-width)); border-radius:0 0 10px 10px; }
      .dixy-atelier-wood-left,.dixy-atelier-wood-right { top:-1px; width:var(--dixy-skin-frame-width); height:calc(100% + 2px); }
      .dixy-atelier-wood-left { left:calc(1px - var(--dixy-skin-frame-width)); }
      .dixy-atelier-wood-right { right:calc(1px - var(--dixy-skin-frame-width)); }
      .dixy-atelier-stitch { position:absolute; inset:5px; border:1px dashed #9b785166; border-radius:8px; box-shadow:0 1px 0 #fff8e044; }
      .dixy-atelier-gilt { position:absolute; top:-7px; left:12%; width:32%; height:1px; background:linear-gradient(90deg,transparent,#f8d9a766,transparent); }
      @keyframes dixy-atelier-detail { from { opacity:.3; } to { opacity:1; } }`;
  details.forest = `
    .dixy-forest-ornament-switch-thumb { display:grid; place-items:center; inset:0; }
    .dixy-forest-control-leaf { width:14px; height:17px; }
    .dixy-switch-thumb:not([data-checked]) .dixy-forest-ornament-switch-thumb,[data-dixy-material-override] .dixy-forest-ornament-switch-thumb { display:none; }
  `;
  details.coral = `@keyframes dixy-ocean-detail { from { opacity:.45; } to { opacity:1; } }`;
  details.cushion = `@keyframes dixy-clay-detail { from { transform:translateY(0); } to { transform:translateY(-2px); } }`;
  details.deco = `@keyframes dixy-deco-detail { from { opacity:.5; } to { opacity:1; } }`;
  details.chamfer = `@keyframes dixy-titanium-detail { from { opacity:.4; } to { opacity:1; } }`;
  details.halo = `@keyframes dixy-light-detail { from { opacity:.35; } to { opacity:.8; } }`;
  details.drafting = `@keyframes dixy-blueprint-detail { from { opacity:.5; } to { opacity:1; } }`;
  details.riso = `@keyframes dixy-riso-detail { from { opacity:.5; } to { opacity:1; } }`;
  details.neon = `@keyframes dixy-neon-detail { from { opacity:.5; } to { opacity:1; } }`;
  details.sumi = `@keyframes dixy-sumi-detail { from { opacity:.5; } to { opacity:1; } }`;
  details.transit = `@keyframes dixy-transit-detail { from { opacity:.5; } to { opacity:1; } }`;
  // 2026-12 launch frames paint on canvas; their detail keyframe is a soft pulse.
  details.crt = `@keyframes dixy-phosphor-detail { from { opacity:.5; } to { opacity:1; } }`;
  details.panes = `@keyframes dixy-ansi-detail { from { opacity:.5; } to { opacity:1; } }`;
  details.swiss = `@keyframes dixy-swiss-detail { from { opacity:.5; } to { opacity:1; } }`;
  details.azulejo = `@keyframes dixy-azulejo-detail { from { opacity:.5; } to { opacity:1; } }`;
  details.formwork = `@keyframes dixy-brutalist-detail { from { opacity:.5; } to { opacity:1; } }`;
  details.atomic = `@keyframes dixy-atomic-detail { from { opacity:.5; } to { opacity:1; } }`;
  details.hud = `@keyframes dixy-hud-detail { from { opacity:.5; } to { opacity:1; } }`;
  details.hazard = `@keyframes dixy-freighter-detail { from { opacity:.5; } to { opacity:1; } }`;
  details.orbit = `@keyframes dixy-sail-detail { from { opacity:.5; } to { opacity:1; } }`;
  details.rangoli = `@keyframes dixy-diwali-detail { from { opacity:.5; } to { opacity:1; } }`;
  details.papercut = `@keyframes dixy-lunar-detail { from { opacity:.5; } to { opacity:1; } }`;
  details.picado = `@keyframes dixy-picado-detail { from { opacity:.5; } to { opacity:1; } }`;
  details.gulal = `@keyframes dixy-holi-detail { from { opacity:.5; } to { opacity:1; } }`;
  details.knit = `@keyframes dixy-yule-detail { from { opacity:.5; } to { opacity:1; } }`;
  details.liquid = `@keyframes dixy-glass-detail { from { opacity:.5; } to { opacity:1; } }`;
  // Scope every legacy ornament selector as well, so two custom frames can coexist.
  const scoped = details[m.frame].replace(
    /(^|[}\n])([ \t]*)(\.dixy-[^{]+)\{/g,
    (_match, before, space, selector) =>
      before +
      space +
      selector
        .split(",")
        .map((part: string) => `${theme} ${part.trim()}`)
        .join(",") +
      " {",
  );
  const texture =
    m.material === "botanical-paper" || m.material === "atelier-paper"
      ? ""
      : `${theme} :is(.dixy-forest-paper,.dixy-atelier-paper,.dixy-atelier-linen) { display:none; }`;
  const organic = isOrganicFrame(m.frame)
    ? `
    ${art}.dixy-organic-ornament { clip-path:none; overflow:visible; border-radius:inherit; }
    ${art} .dixy-organic-canvas { display:block; position:absolute; left:-32px; top:-32px; width:calc(100% + 64px); height:calc(100% + 64px); pointer-events:none; }
  `
    : "";
  return common + scoped + texture + organic;
}
