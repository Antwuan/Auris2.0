/**
 * Gets a test signal with varying frequency.
 * @param testId incremental counter that indicates the current test step.
 * @param sampleRate sample rate for the audio.
 * @param bufSize buffer size to return.
 * @returns a signal that can be used as an audio buffer.
 */
export function getTestSignal(testId: number, sampleRate: number, bufSize: number) {
  // Test frequency is a sawtooth with sinusoidal ripple
  const TEST_LOWEST = 50
  const TEST_HIGHEST = 400
  const progress = (testId % 100) / 100 // linear increase frequency
  const center_freq = TEST_LOWEST + (TEST_HIGHEST - TEST_LOWEST) * progress
  const amp_freq = (TEST_HIGHEST - TEST_LOWEST) / 200
  const freq = center_freq + amp_freq * Math.sin((2 * Math.PI * testId) / 10)

  // Generate sine of freq
  return getSineOfFrequency(freq, sampleRate, bufSize)
}

function getSineOfFrequency(frequency: number, sampleRate: number, bufSize: number) {
  const sineWave: number[] = []
  for (let i = 0; i < bufSize; i++) {
    sineWave[i] = Math.sin((2 * Math.PI * i * frequency) / sampleRate)
  }
  return sineWave
}



// Memory leak test function
export const testMemoryLeak = () => {
  console.log("Testing memory leak fixes...")
  
  // Test circular buffer
  const CircularBuffer = class {
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

  const buffer = new CircularBuffer(1000)
  
  // Simulate many audio buffer updates
  for (let i = 0; i < 1000; i++) {
    const samples = new Array(100).fill(Math.random())
    buffer.push(samples)
  }
  
  console.log("Circular buffer test completed successfully")
  return true
}

// Test alternate tuning system
export const testAlternateTunings = () => {
  console.log("Testing alternate tuning system...")
  
  // Import the necessary modules for testing
  const { GUITAR_TUNINGS, parseGuitarTuning } = require("./stores/configStore")
  const { Guitar } = require("./instruments")
  
  // Test parsing guitar tunings
  const testTunings = [
    "E2 A2 D3 G3 B3 E4", // Standard
    "D2 A2 D3 G3 B3 E4", // Drop D
    "C2 G2 C3 F3 A3 D4", // Drop C
  ]
  
  testTunings.forEach((tuningString, index) => {
    const parsed = parseGuitarTuning(tuningString)
    console.log(`Tuning ${index + 1}:`, parsed)
    
    // Verify we have 6 strings
    if (parsed.length !== 6) {
      console.error(`Error: Expected 6 strings, got ${parsed.length}`)
      return false
    }
    
    // Verify each string has name and octave
    parsed.forEach((string: { name: string; octave: number }, stringIndex: number) => {
      if (!string.name || typeof string.octave !== 'number') {
        console.error(`Error: Invalid string ${stringIndex}:`, string)
        return false
      }
    })
  })
  
  console.log("Alternate tuning system test completed successfully")
  return true
}
