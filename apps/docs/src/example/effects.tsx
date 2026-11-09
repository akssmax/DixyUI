import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { shaderForSkin, type ShaderPairing } from "../lab/shader-pairings";
import type { ShaderStatus } from "../lab/shader-runtime";

/**
 * The animated-background preference for Fernpay. Off by default: it is an
 * opt-in, per-viewer convenience kept in browser storage, and the app looks
 * finished without it.
 */
const storageKey = "fernpay-shader";

export type EffectState = ShaderStatus["state"] | "off" | "starting";

interface EffectsValue {
  enabled: boolean;
  setEnabled: (next: boolean) => void;
  /** The shader paired with the current skin, if any. */
  pairing: ShaderPairing | undefined;
  state: EffectState;
  setState: (next: EffectState) => void;
  skin: string;
  onSkin: (slug: string) => void;
}

const EffectsContext = createContext<EffectsValue | null>(null);

export function EffectsProvider({
  skin,
  onSkin,
  children,
}: {
  skin: string;
  onSkin: (slug: string) => void;
  children: ReactNode;
}) {
  const [enabled, setEnabledState] = useState(false);
  const [state, setState] = useState<EffectState>("off");
  useEffect(() => {
    try {
      setEnabledState(localStorage.getItem(storageKey) === "on");
    } catch {}
  }, []);
  function setEnabled(next: boolean) {
    setEnabledState(next);
    try {
      localStorage.setItem(storageKey, next ? "on" : "off");
    } catch {}
  }
  const pairing = shaderForSkin(skin);
  useEffect(() => {
    setState(enabled && pairing ? "starting" : "off");
  }, [enabled, pairing]);
  return (
    <EffectsContext.Provider
      value={{ enabled, setEnabled, pairing, state, setState, skin, onSkin }}
    >
      {children}
    </EffectsContext.Provider>
  );
}

export function useEffects() {
  const value = useContext(EffectsContext);
  if (!value) throw new Error("useEffects needs <EffectsProvider>");
  return value;
}
