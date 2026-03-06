import { create } from "zustand";
import { persist } from "zustand/middleware";

export type EnergyLevel = "low" | "medium" | "high";
export type FontSize = "normal" | "large" | "extra";

interface CognitiveSettingsStore {
  energy: EnergyLevel;
  fontSize: FontSize;
  darkMode: boolean;
  reduceAnimations: boolean;
  muteNotifications: boolean;

  setEnergy: (value: EnergyLevel) => void;
  setFontSize: (value: FontSize) => void;
  toggleDarkMode: () => void;
  toggleReduceAnimations: () => void;
  toggleMuteNotifications: () => void;
  reset: () => void;
}

export const useCognitiveSettingsStore = create<CognitiveSettingsStore>()(
  persist(
    (set) => ({
      energy: "high",
      fontSize: "normal",
      darkMode: false,
      reduceAnimations: false,
      muteNotifications: false,

      setEnergy: (value) => set({ energy: value }),

      setFontSize: (value) => set({ fontSize: value }),

      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      toggleReduceAnimations: () =>
        set((state) => ({ reduceAnimations: !state.reduceAnimations })),

      toggleMuteNotifications: () =>
        set((state) => ({
          muteNotifications: !state.muteNotifications,
        })),

      reset: () =>
        set({
          energy: "high",
          fontSize: "normal",
          reduceAnimations: false,
          muteNotifications: false,
        }),
    }),
    {
      name: "cognitive-settings",
    },
  ),
);
