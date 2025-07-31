import React from "react"
import { View, Text, Pressable, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Colors from "@/Colors"
import { PERFORMANCE_MODES, PerformanceMode } from "@/config/performance"

interface PerformanceToggleProps {
  currentMode: PerformanceMode
  onModeChange: (mode: PerformanceMode) => void
  positionY: number
}

const PERFORMANCE_LABELS: Record<PerformanceMode, { label: string; icon: string; description: string }> = {
  HIGH_PERFORMANCE: {
    label: "Performance",
    icon: "speedometer",
    description: "Optimized for speed",
  },
  BALANCED: {
    label: "Balanced",
    icon: "balance-scale",
    description: "Good balance",
  },
  HIGH_QUALITY: {
    label: "Quality",
    icon: "star",
    description: "Best visual quality",
  },
}

export const PerformanceToggle: React.FC<PerformanceToggleProps> = ({
  currentMode,
  onModeChange,
  positionY,
}) => {
  const modes: PerformanceMode[] = ["HIGH_PERFORMANCE", "BALANCED", "HIGH_QUALITY"]

  return (
    <View style={[styles.container, { top: positionY }]}>
      <Text style={styles.title}>Performance Mode</Text>
      <View style={styles.buttonContainer}>
        {modes.map((mode) => {
          const isActive = mode === currentMode
          const { label, icon, description } = PERFORMANCE_LABELS[mode]
          
          return (
            <Pressable
              key={mode}
              style={[styles.button, isActive && styles.activeButton]}
              onPress={() => onModeChange(mode)}
            >
              <Ionicons
                name={icon as any}
                size={16}
                color={isActive ? Colors.primary : Colors.secondary}
              />
              <Text style={[styles.buttonText, isActive && styles.activeButtonText]}>
                {label}
              </Text>
              <Text style={[styles.description, isActive && styles.activeDescription]}>
                {description}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 12,
    padding: 16,
    minWidth: 200,
    zIndex: 1000,
  },
  title: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  buttonContainer: {
    gap: 8,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  activeButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  buttonText: {
    color: Colors.secondary,
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 8,
    flex: 1,
  },
  activeButtonText: {
    color: Colors.primary,
  },
  description: {
    color: Colors.secondary,
    fontSize: 10,
    opacity: 0.7,
  },
  activeDescription: {
    color: Colors.primary,
    opacity: 0.8,
  },
}) 