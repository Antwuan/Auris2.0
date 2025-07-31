import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { zustandStorage } from "./localStorage"
import { PerformanceMode } from "@/config/performance"

export const INSTRUMENT_IDS = ["guitar", "chromatic"] as const
export const TUNING_IDS = ["ref_440", "ref_432", "ref_444"] as const

// Guitar tuning presets
export const GUITAR_TUNINGS = {
  standard: "E2 A2 D3 G3 B3 E4",
  dropD: "D2 A2 D3 G3 B3 E4",
  dropDSharp: "D#2 G#2 C#3 F#3 A#3 D#4",
  dStandard: "D2 G2 C3 F3 A3 D4",
  cSharpStandard: "C#2 F#2 B2 E3 G#3 C#4",
  dropC: "C2 G2 C3 F3 A3 D4",
  openE7: "E2 G#2 D3 E3 B3 E4",
  openEMinor7: "E2 B2 D3 G3 B3 E4",
} as const

export type InstrumentType = (typeof INSTRUMENT_IDS)[number]
export type TuningType = (typeof TUNING_IDS)[number]
export type GuitarTuningType = keyof typeof GUITAR_TUNINGS

export interface ConfigState {
  instrument: InstrumentType
  theme: "dark"
  language: "en"
  tuning: TuningType
  guitarTuning: GuitarTuningType
  graphics: "high"
  manual: boolean
  performanceMode: PerformanceMode
  setInstrument: (instrument: InstrumentType) => void
  setTuning: (tuning: TuningType) => void
  setGuitarTuning: (tuning: GuitarTuningType) => void
  setManual: (manual: boolean) => void
  setPerformanceMode: (mode: PerformanceMode) => void
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
      guitarTuning: "standard",
      manual: false,
      performanceMode: "BALANCED",

      setInstrument: (instrument: InstrumentType) => set({ instrument }),
      setTuning: (tuning: TuningType) => set({ tuning }),
      setGuitarTuning: (guitarTuning: GuitarTuningType) => set({ guitarTuning }),
      setManual: (manual) => set({ manual }),
      setPerformanceMode: (mode: PerformanceMode) => set({ performanceMode: mode }),
    }),
    {
      name: "config-store",
      storage: createJSONStorage(() => zustandStorage),
      merge: (persistedState, currentState) => {
        const loadedState = { ...currentState }
        const savedState = persistedState as ConfigState

        // Load only valid configuration keys from savedState
        // NOTE omitted on purpose: instrument, tuning, guitarTuning or manual
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

// Parse guitar tuning string to Note array
export function parseGuitarTuning(tuningString: string): Array<{ name: string; octave: number }> {
  return tuningString.split(' ').map(note => {
    const name = note.slice(0, -1) // Remove last character (octave)
    const octave = parseInt(note.slice(-1)) // Get last character as octave
    return { name, octave }
  })
}
