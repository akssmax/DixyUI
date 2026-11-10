import { useCallback, useSyncExternalStore } from "react";

/* Single-key shortcuts (Shift+R counts: it types a capital R) must be
   possible to turn off under WCAG 2.1.4. The choice is kept per visitor and
   shared by every component that reads it. Storage can be blocked, so reads
   and writes are guarded and the server always assumes "on". */
const storageKey = "dixy-shortcuts";
const listeners = new Set<() => void>();
let current: boolean | null = null;

function read(): boolean {
  if (current !== null) return current;
  try {
    current = window.localStorage.getItem(storageKey) !== "off";
  } catch {
    current = true;
  }
  return current;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useShortcutsEnabled() {
  const enabled = useSyncExternalStore(subscribe, read, () => true);
  const setEnabled = useCallback((next: boolean) => {
    current = next;
    try {
      if (next) window.localStorage.removeItem(storageKey);
      else window.localStorage.setItem(storageKey, "off");
    } catch {
      /* storage blocked: the choice lasts for this page */
    }
    listeners.forEach((listener) => listener());
  }, []);
  return [enabled, setEnabled] as const;
}
