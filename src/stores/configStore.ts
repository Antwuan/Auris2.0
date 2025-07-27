import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { zustandStorage } from "./localStorage"

export const INSTRUMENT_IDS = ["guitar", "chromatic"] as const
export const TUNING_IDS = ["ref_440", "ref_432", "ref_444"] as const

export type InstrumentType = (typeof INSTRUMENT_IDS)[number]
export type TuningType = (typeof TUNING_IDS)[number]

export interface ConfigState {
  instrument: InstrumentType
  theme: "dark"
  language: "en"
  tuning: TuningType
  graphics: "high"
  manual: boolean
  setInstrument: (instrument: InstrumentType) => void
  setTuning: (tuning: TuningType) => void
  setManual: (manual: boolean) => void
}

/**
 * Zustand hook to use global state
 * @returns global store handler
 */
export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      // Persistent values
      theme: "dark",
      language: "en",
      graphics: "high",

      // Not persistent values below (see merge function)
      instrument: "guitar",
      tuning: "ref_440",
      manual: false,

      setInstrument: (instrument: InstrumentType) => set({ instrument }),
      setTuning: (tuning: TuningType) => set({ tuning }),
      setManual: (manual) => set({ manual }),
    }),
    {
      name: "config-store",
      storage: createJSONStorage(() => zustandStorage),
      merge: (persistedState, currentState) => {
        const loadedState = { ...currentState }
        const savedState = persistedState as ConfigState

        // Load only valid configuration keys from savedState
        // NOTE omitted on purpose: instrument, tuning or manual
        // Theme, language, and graphics are now fixed to defaults
        return loadedState
      },
    }
  )
)



export function getTuningFreq(tuning: TuningType): number {
  switch (tuning) {
    case "ref_440":
      return 440
    case "ref_432":
      return 432
    case "ref_444":
      return 444
  }
}
