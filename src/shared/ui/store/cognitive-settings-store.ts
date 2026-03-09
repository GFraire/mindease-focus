import { create } from "zustand";
import { persist } from "zustand/middleware";

export type EnergyLevel = "low" | "medium" | "high";
export type InterfaceComplexity = "basic" | "intermediate" | "advanced";

interface CognitiveSettingsStore {
  energy: EnergyLevel;
  interfaceComplexity: InterfaceComplexity;
  darkMode: boolean;
  reduceNotifications: boolean;
  muteNotifications: boolean;
  setEnergy: (value: EnergyLevel) => void;
  setInterfaceComplexity: (value: InterfaceComplexity) => void;
  toggleDarkMode: () => void;
  toggleReduceNotifications: () => void;
  toggleMuteNotifications: () => void;

  reset: () => void;
}

export const useCognitiveSettingsStore = create<CognitiveSettingsStore>()(
  persist(
    (set) => ({
      energy: "high",
      interfaceComplexity: "intermediate",
      darkMode: false,
      reduceNotifications: false,
      muteNotifications: false,
      setEnergy: (value) => set({ energy: value }),
      setInterfaceComplexity: (value) => set({ interfaceComplexity: value }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      toggleMuteNotifications: () =>
        set((state) => ({ muteNotifications: !state.muteNotifications })),
      toggleReduceNotifications: () =>
        set((state) => ({
          reduceNotifications: !state.reduceNotifications,
        })),

      reset: () =>
        set({
          energy: "high",
          interfaceComplexity: "intermediate",
          darkMode: false,
          reduceNotifications: false,
        }),
    }),
    {
      name: "cognitive-settings",
    },
  ),
);
