/**
 * Theme fixes are deep partial patches over a starter document. Objects merge
 * key by key; any other value (including arrays) replaces the starter's.
 */
export type ThemeFix = { readonly [key: string]: unknown };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Return `base` with `fix` merged in. Neither input is changed. */
export function applyThemeFix<T>(base: T, fix: ThemeFix | undefined): T {
  if (!fix) return base;
  return merge(base, fix) as T;
}
function merge(base: unknown, patch: unknown): unknown {
  if (!isRecord(base) || !isRecord(patch)) return patch;
  const result: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(patch))
    result[key] = merge(base[key], value);
  return result;
}

/** The smallest patch that turns `base` into `next`, or undefined if equal. */
export function diffThemeDocument(
  base: unknown,
  next: unknown,
): ThemeFix | undefined {
  const patch = diff(base, next);
  return isRecord(patch) ? patch : undefined;
}
function diff(base: unknown, next: unknown): unknown {
  if (isRecord(base) && isRecord(next)) {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(next)) {
      const change = diff(base[key], next[key]);
      if (change !== undefined) result[key] = change;
    }
    return Object.keys(result).length ? result : undefined;
  }
  return JSON.stringify(base) === JSON.stringify(next) ? undefined : next;
}
