/** Used only for trusted schema/registry constants and compiler data, never executable input. */
export function freezeData<const T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) freezeData(child);
    Object.freeze(value);
  }
  return value;
}
