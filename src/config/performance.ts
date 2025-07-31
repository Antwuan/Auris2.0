// Performance configuration for the tuner app
// Adjust these values to balance performance vs responsiveness

export const PERFORMANCE_CONFIG = {
  // Audio processing
  BUFFER_SIZE: 4500, // Reduced from 9000
  BUFFERS_PER_SECOND: 10, // Reduced from 15
  PROCESSING_THROTTLE: 2, // Only process every 2nd buffer
  
  // MovingGrid optimizations
  GRID_SPEED: 60, // Reduced from 120 pixels per second
  MAX_HISTORY_SIZE: 50, // Fixed history size instead of dynamic
  GRID_UPDATE_FREQUENCY: 3, // Only update every 3rd pitch change
  
  // Waveform optimizations
  WAVEFORM_REFRESH_FRAMES: 3, // Increased from 1
  WAVEFORM_SUBSAMPLE: 24, // Increased from 12
  WAVEFORM_MIN_SUBSAMPLE_SIZE: 20, // Increased from 10
  WAVEFORM_MAX_SIZE: 1024, // Reduced from 2048
  
  // Animation optimizations
  ENABLE_GRID_ANIMATION: true,
  ENABLE_WAVEFORM_ANIMATION: true,
  
  // Memory management
  CIRCULAR_BUFFER_SIZE: 4500,
  
  // Pitch detection
  MIN_FREQ: 30,
  MAX_FREQ: 500,
  MAX_PITCH_DEV: 0.2,
  THRESHOLD_DEFAULT: 0.15,
  THRESHOLD_NOISY: 0.6,
  RMS_GAP: 1.1,
  ENABLE_FILTER: true,
}

// Performance modes
export const PERFORMANCE_MODES = {
  HIGH_PERFORMANCE: {
    ...PERFORMANCE_CONFIG,
    BUFFERS_PER_SECOND: 8,
    PROCESSING_THROTTLE: 3,
    GRID_UPDATE_FREQUENCY: 5,
    WAVEFORM_REFRESH_FRAMES: 5,
    ENABLE_GRID_ANIMATION: false,
    ENABLE_WAVEFORM_ANIMATION: false,
  },
  BALANCED: PERFORMANCE_CONFIG,
  HIGH_QUALITY: {
    ...PERFORMANCE_CONFIG,
    BUFFERS_PER_SECOND: 15,
    PROCESSING_THROTTLE: 1,
    GRID_UPDATE_FREQUENCY: 1,
    WAVEFORM_REFRESH_FRAMES: 1,
    WAVEFORM_SUBSAMPLE: 12,
    WAVEFORM_MAX_SIZE: 2048,
  },
}

export type PerformanceMode = keyof typeof PERFORMANCE_MODES 