/**
 * Theme audit checks. They measure what the browser actually renders, so
 * they catch problems that come from the combination of a theme's tokens,
 * material and component CSS. Each specimen element carries
 * `data-audit="<role>"`; the role decides which checks apply.
 */

export type AuditCheck =
  "contrast" | "boundary" | "focus" | "target" | "overflow";
export type AuditSeverity = "fail" | "warn";

export interface AuditIssue {
  check: AuditCheck;
  severity: AuditSeverity;
  /** Specimen role, e.g. "button-solid" or "text-muted". */
  role: string;
  /** Short human summary. */
  message: string;
  measured?: string;
  required?: string;
  foreground?: string;
  background?: string;
}

/** Roles and what each one is checked for. */
const textRoles: Record<string, string> = {
  heading: "Card title",
  "text-body": "Card description",
  "text-muted": "Muted text",
  "button-solid": "Solid button label",
  "button-outline": "Outline button label",
  "button-soft": "Soft button label",
  badge: "Badge label",
  "input-value": "Field text",
};
const focusRoles = new Set([
  "button-solid",
  "button-outline",
  "input",
  "switch",
  "checkbox",
]);
const targetRoles = new Set([
  "button-solid",
  "button-outline",
  "button-soft",
  "switch",
  "checkbox",
]);
const overflowRoles = new Set([
  "button-solid",
  "button-outline",
  "button-soft",
  "badge",
]);

type Rgba = [number, number, number, number];

let context: CanvasRenderingContext2D | null = null;
/** Resolve any CSS colour (oklch, color-mix, …) to sRGB via a 1×1 canvas. */
function toRgba(color: string): Rgba {
  context ??= Object.assign(document.createElement("canvas"), {
    width: 1,
    height: 1,
  }).getContext("2d", { willReadFrequently: true });
  if (!context) return [0, 0, 0, 1];
  context.clearRect(0, 0, 1, 1);
  context.fillStyle = "#000";
  context.fillStyle = color;
  context.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;
  return [r!, g!, b!, a! / 255];
}
const over = (top: Rgba, bottom: Rgba): Rgba => {
  const a = top[3] + bottom[3] * (1 - top[3]);
  if (a === 0) return [0, 0, 0, 0];
  const mix = (i: number) =>
    (top[i]! * top[3] + bottom[i]! * bottom[3] * (1 - top[3])) / a;
  return [mix(0), mix(1), mix(2), a];
};
const luminance = ([r, g, b]: Rgba) => {
  const channel = (c: number) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};
const ratio = (a: Rgba, b: Rgba) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
};
const hex = ([r, g, b]: Rgba) =>
  "#" +
  [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("");

/**
 * The colour behind an element: its own and its ancestors' backgrounds,
 * composited until one is opaque. Gradients and images can't be measured
 * as one colour, so they are reported as approximate.
 */
function backdrop(element: Element, stop: Element) {
  const layers: Rgba[] = [];
  let approximate = false;
  for (
    let node: Element | null = element;
    node;
    node = node === stop ? null : node.parentElement
  ) {
    const style = getComputedStyle(node);
    if (style.backgroundImage !== "none") approximate = true;
    const color = toRgba(style.backgroundColor);
    if (color[3] > 0) layers.push(color);
    if (color[3] >= 0.999) break;
  }
  let result: Rgba = [255, 255, 255, 1];
  for (const layer of layers.reverse()) result = over(layer, result);
  return { color: result, approximate };
}

function contrastIssue(
  element: Element,
  role: string,
  stop: Element,
  pseudo?: string,
): AuditIssue | null {
  const style = getComputedStyle(element, pseudo);
  const { color: bg, approximate } = backdrop(element, stop);
  const fg = over(toRgba(style.color), bg);
  const size = parseFloat(style.fontSize);
  const large =
    size >= 24 || (size >= 18.66 && Number(style.fontWeight) >= 700);
  const need = large ? 3 : 4.5;
  const value = Math.floor(ratio(fg, bg) * 100) / 100;
  if (value >= need) return null;
  return {
    check: "contrast",
    // Below the large-text floor is always a failure; a gradient behind the
    // text makes the measurement approximate, so that's a warning.
    severity: approximate && value >= 3 ? "warn" : "fail",
    role,
    message: `${textRoles[role] ?? role} is ${value.toFixed(2)}:1, needs ${need}:1${approximate ? " (approximate: gradient or image behind it)" : ""}`,
    measured: `${value.toFixed(2)}:1`,
    required: `${need}:1`,
    foreground: hex(fg),
    background: hex(bg),
  };
}

/**
 * WCAG 1.4.11: a field's edge needs 3:1 against what surrounds it. Either
 * the border or the field's own fill can provide that edge.
 */
function boundaryIssue(element: HTMLElement, root: Element): AuditIssue | null {
  const input = element.matches("input")
    ? element
    : element.querySelector<HTMLElement>("input");
  if (!input) return null;
  // The border may sit on a wrapper (input groups); use the first one drawn.
  let box: HTMLElement = input;
  for (let node: HTMLElement | null = input; node && node !== root;) {
    const style = getComputedStyle(node);
    if (
      style.borderTopStyle !== "none" &&
      parseFloat(style.borderTopWidth) > 0
    ) {
      box = node;
      break;
    }
    if (node === element) break;
    node = node.parentElement;
  }
  const style = getComputedStyle(box);
  const outside = backdrop(box.parentElement ?? box, root).color;
  const fill = over(toRgba(style.backgroundColor), outside);
  const hasBorder =
    style.borderTopStyle !== "none" && parseFloat(style.borderTopWidth) > 0;
  const border = hasBorder ? over(toRgba(style.borderTopColor), outside) : fill;
  const value =
    Math.floor(Math.max(ratio(border, outside), ratio(fill, outside)) * 100) /
    100;
  if (value >= 3) return null;
  return {
    check: "boundary",
    severity: "fail",
    role: "input",
    message: `Field edge is ${value.toFixed(2)}:1 against the surface around it, needs 3:1 (border or fill)`,
    measured: `${value.toFixed(2)}:1`,
    required: "3:1",
    foreground: hex(border),
    background: hex(outside),
  };
}

/**
 * Focus styles are measured without real focus: Chrome only matches
 * :focus-visible after keyboard input, and never while the window is in the
 * background. So every :focus / :focus-visible rule on the page is mirrored
 * onto [data-audit-focus], which the check sets on one element at a time.
 */
const focusSelector = /:focus-visible|:focus(?![-\w])/g;
function mirrorRules(
  rules: CSSRuleList,
  wrap: (css: string) => string,
  out: string[],
) {
  for (const rule of rules) {
    if (rule instanceof CSSStyleRule) {
      if (focusSelector.test(rule.selectorText))
        out.push(
          wrap(
            `${rule.selectorText.replace(focusSelector, "[data-audit-focus]")}{${rule.style.cssText}}`,
          ),
        );
      focusSelector.lastIndex = 0;
    } else if (rule instanceof CSSMediaRule)
      mirrorRules(
        rule.cssRules,
        (css) => wrap(`@media ${rule.conditionText}{${css}}`),
        out,
      );
    else if (rule instanceof CSSSupportsRule)
      mirrorRules(
        rule.cssRules,
        (css) => wrap(`@supports ${rule.conditionText}{${css}}`),
        out,
      );
    else if (rule instanceof CSSLayerBlockRule)
      mirrorRules(
        rule.cssRules,
        (css) => wrap(`@layer ${rule.name}{${css}}`),
        out,
      );
    else if (
      typeof CSSContainerRule !== "undefined" &&
      rule instanceof CSSContainerRule
    )
      mirrorRules(
        rule.cssRules,
        (css) => wrap(`@container ${rule.conditionText}{${css}}`),
        out,
      );
  }
}
/** Install the focus mirror; returns a function that removes it. */
export function installFocusMirror(): () => void {
  const out: string[] = [];
  for (const sheet of document.styleSheets) {
    try {
      mirrorRules(sheet.cssRules, (css) => css, out);
    } catch {
      // Cross-origin sheets (fonts) can't be read and hold no focus rules.
    }
  }
  const style = document.createElement("style");
  style.dataset.auditFocusMirror = "";
  style.textContent = out.join("\n");
  document.head.append(style);
  return () => style.remove();
}

const ring = (style: CSSStyleDeclaration) =>
  `${style.outlineStyle} ${style.outlineWidth} ${style.outlineColor} ${style.boxShadow} ${style.borderColor} ${style.backgroundColor}`;

function focusIssue(
  element: HTMLElement,
  role: string,
  root: Element,
): AuditIssue | null {
  const target = element.matches("input, textarea, button, [tabindex]")
    ? element
    : element.querySelector<HTMLElement>("input, textarea, button, [tabindex]");
  if (!target) return null;
  const resting = ring(getComputedStyle(target));
  target.setAttribute("data-audit-focus", "");
  for (const animation of target.getAnimations()) animation.finish();
  const style = getComputedStyle(target);
  const focused = ring(style);
  const outline =
    style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0;
  let issue: AuditIssue | null = null;
  if (focused === resting)
    issue = {
      check: "focus",
      severity: "fail",
      role,
      message: `No visible change when ${role} is focused`,
    };
  else if (outline) {
    const bg = backdrop(target.parentElement ?? target, root).color;
    const value =
      Math.floor(ratio(over(toRgba(style.outlineColor), bg), bg) * 100) / 100;
    if (value < 3)
      issue = {
        check: "focus",
        severity: "fail",
        role,
        message: `Focus ring on ${role} is ${value.toFixed(2)}:1 against what's behind it, needs 3:1`,
        measured: `${value.toFixed(2)}:1`,
        required: "3:1",
        foreground: hex(toRgba(style.outlineColor)),
        background: hex(bg),
      };
  }
  target.removeAttribute("data-audit-focus");
  for (const animation of target.getAnimations()) animation.finish();
  return issue;
}

/** Run every check on one rendered specimen. */
export function auditSpecimen(root: Element): AuditIssue[] {
  const issues: AuditIssue[] = [];
  for (const element of root.querySelectorAll<HTMLElement>("[data-audit]")) {
    const role = element.dataset.audit!;
    if (role === "input") {
      const input = element.matches("input")
        ? element
        : element.querySelector("input");
      if (input) {
        const value = contrastIssue(input, "input-value", root);
        if (value) issues.push(value);
      }
      const boundary = boundaryIssue(element, root);
      if (boundary) issues.push(boundary);
    } else if (textRoles[role]) {
      const issue = contrastIssue(element, role, root);
      if (issue) issues.push(issue);
    }
    if (focusRoles.has(role)) {
      const issue = focusIssue(element, role, root);
      if (issue) issues.push(issue);
    }
    if (targetRoles.has(role)) {
      const box = element.getBoundingClientRect();
      if (box.width < 24 || box.height < 24)
        issues.push({
          check: "target",
          severity: "warn",
          role,
          message: `${role} is ${Math.round(box.width)}×${Math.round(box.height)}px; 24×24 is the WCAG 2.2 minimum unless it has spacing around it`,
          measured: `${Math.round(box.width)}×${Math.round(box.height)}`,
          required: "24×24",
        });
    }
    if (
      overflowRoles.has(role) &&
      element.scrollWidth > element.clientWidth + 1
    )
      issues.push({
        check: "overflow",
        severity: "fail",
        role,
        message: `${role} clips its label (${element.scrollWidth}px of content in ${element.clientWidth}px)`,
      });
  }
  // Ornaments may bleed past the edge on purpose; only content counts.
  const edge = root.getBoundingClientRect().right;
  for (const element of root.querySelectorAll<HTMLElement>("[data-audit]")) {
    const past = element.getBoundingClientRect().right - edge;
    if (past > 1)
      issues.push({
        check: "overflow",
        severity: "fail",
        role: element.dataset.audit!,
        message: `${element.dataset.audit} runs ${Math.round(past)}px past the edge of its card`,
      });
  }
  return issues;
}
