/** Add our class without dropping Base UI's state-based className callback. */
export function withClassName<State>(
  base: string,
  className?: string | ((state: State) => string | undefined),
): string | ((state: State) => string) {
  if (typeof className === "function") {
    return (state) => [base, className(state)].filter(Boolean).join(" ");
  }
  return [base, className].filter(Boolean).join(" ");
}
