"use client";

import { createContext } from "react";

export interface DialogFocusContextValue {
  registerTrigger: (trigger: HTMLButtonElement) => void;
  restoreTrigger: () => void;
}

export const DialogFocusContext = createContext<DialogFocusContextValue>({
  registerTrigger: () => {},
  restoreTrigger: () => {},
});
