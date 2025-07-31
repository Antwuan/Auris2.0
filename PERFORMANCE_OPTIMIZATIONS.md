# Performance Optimizations for Auris 2.0 Tuner

This document outlines the performance optimizations implemented to address the tuner app's performance issues, including slow response times and freezing after extended use.

## Overview of Issues

The original implementation had several performance bottlenecks:

1. **High audio processing frequency**: 15 buffers per second with large buffer sizes (9000 samples)
2. **Excessive UI animations**: Continuous grid movement and waveform updates
3. **Memory leaks**: Frequent array copying and inefficient history management
4. **Complex calculations**: Real-time path generation and interpolation

## Implemented Optimizations

### 1. Audio Processing Optimizations

- **Reduced buffer rate**: From 15 to 10 buffers per second
- **Smaller buffer size**: From 9000 to 4500 samples
- **Processing throttling**: Only process every 2nd buffer by default
- **Circular buffer**: Prevents memory leaks from continuous audio processing

### 2. MovingGrid Component Optimizations

- **Reduced animation speed**: From 120 to 60 pixels per second
- **Fixed history size**: 50 points instead of dynamic calculation
- **Update frequency**: Only update every 3rd pitch change
- **Simplified calculations**: Reduced computational overhead

### 3. Waveform Component Optimizations

- **Increased refresh interval**: From every frame to every 3rd frame
- **Reduced subsampling**: From 12 to 24 samples per point
- **Smaller audio chunks**: From 2048 to 1024 samples
- **Optimized path generation**: Reduced complexity of waveform rendering

### 4. Performance Configuration System

Created a centralized performance configuration system with three modes:

#### High Performance Mode
- 8 buffers per second
- Process every 3rd buffer
- Disabled animations
- Minimal UI updates

#### Balanced Mode (Default)
- 10 buffers per second
- Process every 2nd buffer
- Reduced animations
- Moderate UI updates

#### High Quality Mode
- 15 buffers per second
- Process every buffer
- Full animations
- Maximum UI updates

## Configuration

All performance settings are centralized in `src/config/performance.ts`:

```typescript
export const PERFORMANCE_CONFIG = {
  BUFFER_SIZE: 4500,
  BUFFERS_PER_SECOND: 10,
  PROCESSING_THROTTLE: 2,
  GRID_SPEED: 60,
  MAX_HISTORY_SIZE: 50,
  GRID_UPDATE_FREQUENCY: 3,
  WAVEFORM_REFRESH_FRAMES: 3,
  // ... more settings
}
```

## Usage

### Switching Performance Modes

Users can switch between performance modes using the PerformanceToggle component:

```typescript
import { PerformanceToggle } from '@/components/PerformanceToggle'
import { useConfigStore } from '@/stores/configStore'

const { performanceMode, setPerformanceMode } = useConfigStore()

<PerformanceToggle
  currentMode={performanceMode}
  onModeChange={setPerformanceMode}
  positionY={100}
/>
```

### Dynamic Configuration

Components automatically adapt to the selected performance mode:

```typescript
import { PERFORMANCE_MODES } from '@/config/performance'
import { useConfigStore } from '@/stores/configStore'

const { performanceMode } = useConfigStore()
const config = PERFORMANCE_MODES[performanceMode]
```

## Expected Performance Improvements

- **Reduced CPU usage**: 40-60% reduction in processing overhead
- **Lower memory consumption**: Fixed buffer sizes prevent memory leaks
- **Smoother animations**: Reduced animation frequency improves frame rates
- **Better responsiveness**: Throttled processing prevents UI blocking
- **Longer battery life**: Reduced processing frequency extends device runtime

## Monitoring Performance

The app includes performance monitoring through React's Profiler:

```typescript
const onRenderCallback = (id: string, phase: string, actualDuration: number) => {
  // Monitor component render times
  console.log(`Component ${id} took ${actualDuration} ms to render`)
}
```

## Future Optimizations

Potential areas for further optimization:

1. **WebAssembly**: Move audio processing to WASM for better performance
2. **Worker threads**: Offload audio processing to background threads
3. **GPU acceleration**: Use GPU for waveform rendering
4. **Adaptive quality**: Automatically adjust quality based on device performance
5. **Caching**: Cache frequently used calculations and paths

## Troubleshooting

If performance issues persist:

1. Switch to High Performance mode
2. Restart the app to clear memory
3. Check device temperature and background processes
4. Update to latest app version
5. Report issues with device specifications

## Native Module Optimizations

The native microphone modules have also been optimized:

- **Android**: Reduced buffer rate in `MicrophoneStreamModule.kt`
- **iOS**: Reduced buffer rate in `MicrophoneStreamModule.swift`
- **Buffer management**: Improved memory handling in circular buffers

These optimizations should significantly improve the app's performance and prevent freezing issues during extended use. 