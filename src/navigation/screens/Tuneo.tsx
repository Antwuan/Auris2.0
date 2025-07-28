import React, { Profiler, useEffect, useMemo, useState, useRef, useCallback } from "react"
import { View, useWindowDimensions, Alert, Pressable } from "react-native"
import { Canvas } from "@shopify/react-native-skia"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"

import DSPModule from "@/../specs/NativeDSPModule"
import MicrophoneStreamModule, { AudioBuffer } from "@/../modules/microphone-stream"
import { AudioModule } from "expo-audio"
import Colors from "@/Colors"
import { getTestSignal } from "@/test"
import MovingGrid from "@/components/MovingGrid"

import { useTranslation } from "@/configHooks"
import { useConfigStore } from "@/stores/configStore"
import { Chromatic, Guitar, Instrument } from "@/instruments"
import { Waveform } from "@/components/Waveform"
import { Strings } from "@/components/Strings"
import { MainNote } from "@/components/MainNote"
import { TuningGauge } from "@/components/TuningGauge"
import RequireMicAccess from "@/components/RequireMicAccess"
import { useUiStore } from "@/stores/uiStore"
import { getRelativeDiff, sameNote } from "@/notes"
import { RightButtons } from "@/components/RightButtons"
import { TuningSelector } from "@/components/TuningSelector"

const TEST_MODE = false

// See python notebook to tweak these params
const BUF_SIZE = 9000
const MIN_FREQ = 30
const MAX_FREQ = 500
const MAX_PITCH_DEV = 0.2
const THRESHOLD_DEFAULT = 0.15
const THRESHOLD_NOISY = 0.6
const RMS_GAP = 1.1
const ENABLE_FILTER = true

// This is just a preference, may be set differently
const BUF_PER_SEC = MicrophoneStreamModule.BUF_PER_SEC
console.log(`Preferred buffers per second: ${BUF_PER_SEC}`)

// Circular buffer implementation to prevent memory leaks
class CircularBuffer {
  private buffer: number[]
  private head: number = 0
  private size: number

  constructor(size: number) {
    this.size = size
    this.buffer = new Array(size).fill(0)
  }

  push(samples: number[]) {
    const len = samples.length
    for (let i = 0; i < len; i++) {
      this.buffer[this.head] = samples[i]
      this.head = (this.head + 1) % this.size
    }
  }

  getBuffer(): number[] {
    const result = new Array(this.size)
    for (let i = 0; i < this.size; i++) {
      result[i] = this.buffer[(this.head + i) % this.size]
    }
    return result
  }

  clear() {
    this.buffer.fill(0)
    this.head = 0
  }
}

type MicrophoneAccess = "pending" | "granted" | "denied"

export const Tuneo = () => {
  const { width, height } = useWindowDimensions()
  const navigation = useNavigation()
  const config = useConfigStore()
  const setManual = useConfigStore((state) => state.setManual)
  const t = useTranslation()

  // Audio buffer using circular buffer to prevent memory leaks
  const [sampleRate, setSampleRate] = useState(0)
  const circularBufferRef = useRef<CircularBuffer>(new CircularBuffer(BUF_SIZE))
  const [bufferId, setBufferId] = useState(0)

  // Flag for microphone access granted
  const [micAccess, setMicAccess] = useState<MicrophoneAccess>("pending")

  // Detected pitch
  const [pitch, setPitch] = useState(-1)

  // Pitch and RMS history
  const pitchQ = useUiStore((state) => state.pitchHistory)
  const rmsQ = useUiStore((state) => state.rmsHistory)
  const idQ = useUiStore((state) => state.idHistory)
  const addPitch = useUiStore((state) => state.addPitch)
  const addRMS = useUiStore((state) => state.addRMS)
  const addId = useUiStore((state) => state.addId)

  // Current string detection filtering
  const stringHistory = useUiStore((state) => state.stringHistory)
  const addString = useUiStore((state) => state.addString)
  const currentString = useUiStore((state) => state.currentString)
  const setCurrentString = useUiStore((state) => state.setCurrentString)
  const cleanup = useUiStore((state) => state.cleanup)

  // Cleanup function for microphone
  const cleanupMicrophone = useCallback(() => {
    try {
      MicrophoneStreamModule.stopRecording()
    } catch (error) {
      console.warn("Error stopping microphone:", error)
    }
  }, [])

  // Request recording permission
  useEffect(() => {
    ;(async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync()
      if (status.granted) {
        console.log("Granted microphone permission")
        setMicAccess("granted")
      } else {
        setMicAccess("denied")
        Alert.alert(t("error_mic_access"))
      }
    })()
  }, [t])

  const onRenderCallback = (id: string, phase: string, actualDuration: number) => {
    // console.log(`Component ${id} took ${actualDuration} ms to render (${phase} phase)`)
  }

  // Start microphone recording
  useEffect(() => {
    if (TEST_MODE || micAccess !== "granted") return

    let subscriber: any = null

    try {
      // Start microphone
      MicrophoneStreamModule.startRecording()
      console.log("Start recording")

      // Subscribe to microphone buffer
      subscriber = MicrophoneStreamModule.addListener(
        "onAudioBuffer",
        (buffer: AudioBuffer) => {
          // Use circular buffer to prevent memory leaks
          circularBufferRef.current.push(buffer.samples)

          // Calculate signal RMS
          addRMS(DSPModule.rms(buffer.samples))
          setBufferId((prevId) => prevId + 1)
        }
      )
    } catch (error) {
      console.error("Error starting microphone:", error)
      setMicAccess("denied")
    }

    return () => {
      if (subscriber) {
        try {
          subscriber.remove()
        } catch (error) {
          console.warn("Error removing subscriber:", error)
        }
      }
      cleanupMicrophone()
    }
  }, [micAccess, addRMS, cleanupMicrophone])

  // Test audio buffers
  useEffect(() => {
    if (!TEST_MODE) return

    const sampleRate = 44100
    const bufSize = sampleRate / BUF_PER_SEC
    const buffer = getTestSignal(bufferId, sampleRate, bufSize)
    setSampleRate(sampleRate)
    circularBufferRef.current.clear()
    circularBufferRef.current.push(buffer)

    // Trigger for next buffer
    const timeout = setTimeout(() => {
      setBufferId((id) => id + 1)
    }, 1000 / BUF_PER_SEC)
    return () => clearTimeout(timeout)
  }, [bufferId, addRMS])

  // Get pitch of the audio
  useEffect(() => {
    if (micAccess !== "granted") return

    // Process each bufferId only once
    if (bufferId === idQ[idQ.length - 1]) return
    addId(bufferId)

    // Set sampleRate after first audio buffer
    let sr = sampleRate
    if (!sr) {
      // Assume microphone already configured ()
      sr = MicrophoneStreamModule.getSampleRate()
      console.log(`Setting sample rate to ${sr}Hz`)
      setSampleRate(sr)
    }

    // Set parameters for pitch estimation
    let minFreq = MIN_FREQ
    let maxFreq = MAX_FREQ
    let threshold = THRESHOLD_DEFAULT

    // Previous RMS and pitch values
    const rms_1 = rmsQ[rmsQ.length - 1]
    const rms_2 = rmsQ[rmsQ.length - 2]
    const pitch_1 = pitchQ[pitchQ.length - 1]
    const pitch_2 = pitchQ[pitchQ.length - 2]

    // Check conditions to restrict pitch search range
    let restrictRange = ENABLE_FILTER
    restrictRange &&= pitch_1 > 0 // Previous pitch detected
    restrictRange &&= rms_1 < rms_2 * RMS_GAP // Decreasing RMS
    restrictRange &&= getRelativeDiff(pitch_1, pitch_2) <= MAX_PITCH_DEV // Stable pitch
    if (restrictRange) {
      minFreq = pitch_1 * (1 - MAX_PITCH_DEV)
      maxFreq = pitch_1 * (1 + MAX_PITCH_DEV)
      threshold = THRESHOLD_NOISY
    }

    // Get current audio buffer from circular buffer
    const audioBuffer = circularBufferRef.current.getBuffer()

    // Estimate pitch
    const pitch = DSPModule.pitch(audioBuffer, sr, minFreq, maxFreq, threshold)
    // console.log(`Pitch: ${pitch.toFixed(1)}Hz  [${minFreq.toFixed(1)}Hz-${maxFreq.toFixed(1)}Hz]`)
    setPitch(pitch)

    // Add values to history
    addPitch(pitch)
  }, [bufferId, sampleRate, micAccess, addId, addPitch, rmsQ, pitchQ, idQ])

  // Selected instrument
  const instrument: Instrument = useMemo(() => {
    switch (config.instrument) {
      case "guitar":
        return new Guitar(config.tuning, config.guitarTuning)
      case "chromatic":
        return new Chromatic(config.tuning)
    }
  }, [config.instrument, config.tuning, config.guitarTuning])

  // Disable manual mode if instrument doesn't support strings
  useEffect(() => {
    if (!instrument.hasStrings) {
      setManual(false)
    }
  }, [instrument, setManual])

  // Add latest string to history
  useEffect(() => {
    if (config.manual) return
    const string = instrument.getNearestString(pitch)
    addString(string)
  }, [pitch, instrument, addString, config.manual])

  // Change currentString (requires 3 votes)
  useEffect(() => {
    if (config.manual) return

    const len = stringHistory.length
    const string1 = stringHistory[len - 1]
    const string2 = stringHistory[len - 2]
    const string3 = stringHistory[len - 3]
    // Never sets currentString to undefined
    if (sameNote(string1?.note, string2?.note) && sameNote(string1?.note, string3?.note)) {
      setCurrentString(string1)
    }
  }, [stringHistory, setCurrentString, config.manual])

  // Tuning gauge indicator
  const gaugeDeviation = useMemo(
    () =>
      pitch > 0 && currentString
        ? Math.atan((10 * (pitch - currentString.freq)) / currentString.freq) / (Math.PI / 2)
        : undefined,
    [pitch, currentString]
  )
  const gaugeWidth = 10
  const gaugeColor = Colors.getColorFromGaugeDeviation(gaugeDeviation)

  // Component sizes and positions
  const waveformY = 60
  const waveformH = height / 8
  const movingGridY = height * 0.55
  const movingGridH = height - movingGridY
  const stringsH = height - waveformY - waveformH - movingGridH - gaugeWidth / 2

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupMicrophone()
      circularBufferRef.current.clear()
      cleanup()
    }
  }, [cleanupMicrophone, cleanup])

  return micAccess === "granted" ? (
    <View style={{ flex: 1, backgroundColor: Colors.bgInactive }}>
      {/* Back Button */}
      <Pressable
        onPress={() => navigation.goBack()}
        style={{
          position: "absolute",
          top: 50,
          left: 20,
          zIndex: 1000,
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.primary} />
      </Pressable>
      
      <Canvas style={{ flex: 1 }}>
        <Profiler id="Waveform" onRender={onRenderCallback}>
          <Waveform
            audioBuffer={circularBufferRef.current.getBuffer()}
            positionY={waveformY}
            height={waveformH}
            bufferId={bufferId}
            bufPerSec={BUF_PER_SEC}
          />
        </Profiler>

        <MainNote
          positionY={movingGridY - gaugeWidth - 10}
          currentString={currentString}
          pitch={pitch}
          gaugeDeviation={gaugeDeviation}
          gaugeColor={gaugeColor}
        />

        <MovingGrid
          positionY={movingGridY}
          pitchId={bufferId}
          deviation={gaugeDeviation}
          pointsPerSec={BUF_PER_SEC}
        />

        <TuningGauge
          positionY={movingGridY}
          gaugeColor={gaugeColor}
          gaugeDeviation={gaugeDeviation}
          gaugeWidth={gaugeWidth}
          framesPerSec={BUF_PER_SEC}
        />
      </Canvas>
      <Strings positionY={waveformY + waveformH} height={stringsH} instrument={instrument} />
      <RightButtons positionY={waveformY + waveformH} instrument={instrument} />
      <TuningSelector positionY={waveformY + waveformH} height={stringsH} />
    </View>
  ) : micAccess === "denied" ? (
    <RequireMicAccess />
  ) : undefined // micAccess "pending"
}
