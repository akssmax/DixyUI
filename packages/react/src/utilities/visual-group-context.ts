import { createContext } from "react";
import type { VisualProps } from "./native-part";
export const ButtonGroupContext = createContext<VisualProps | null>(null);
export const AvatarGroupContext = createContext<VisualProps | null>(null);
