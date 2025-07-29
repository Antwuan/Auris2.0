import React, { useState, useMemo } from "react"
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native"
import { useNavigation } from "@react-navigation/native"
import Colors from "@/Colors"
import { useTranslation } from "@/configHooks"
import { Ionicons } from "@expo/vector-icons"


// Piano key data
const PIANO_KEYS = [
  { note: "C", isBlack: false, octave: 4 },
  { note: "C#", isBlack: true, octave: 4 },
  { note: "D", isBlack: false, octave: 4 },
  { note: "D#", isBlack: true, octave: 4 },
  { note: "E", isBlack: false, octave: 4 },
  { note: "F", isBlack: false, octave: 4 },
  { note: "F#", isBlack: true, octave: 4 },
  { note: "G", isBlack: false, octave: 4 },
  { note: "G#", isBlack: true, octave: 4 },
  { note: "A", isBlack: false, octave: 4 },
  { note: "A#", isBlack: true, octave: 4 },
  { note: "B", isBlack: false, octave: 4 },
  { note: "C", isBlack: false, octave: 5 },
  { note: "C#", isBlack: true, octave: 5 },
  { note: "D", isBlack: false, octave: 5 },
  { note: "D#", isBlack: true, octave: 5 },
  { note: "E", isBlack: false, octave: 5 },
  { note: "F", isBlack: false, octave: 5 },
  { note: "F#", isBlack: true, octave: 5 },
  { note: "G", isBlack: false, octave: 5 },
  { note: "G#", isBlack: true, octave: 5 },
  { note: "A", isBlack: false, octave: 5 },
  { note: "A#", isBlack: true, octave: 5 },
  { note: "B", isBlack: false, octave: 5 },
]

// Chord formulas and structures
const CHORD_FORMULAS = {
  major: { name: "Major", formula: "1-3-5", intervals: [0, 4, 7], color: "#4CAF50" },
  minor: { name: "Minor", formula: "1-♭3-5", intervals: [0, 3, 7], color: "#2196F3" },
  diminished: { name: "Diminished", formula: "1-♭3-♭5", intervals: [0, 3, 6], color: "#FF9800" },
  augmented: { name: "Augmented", formula: "1-3-♯5", intervals: [0, 4, 8], color: "#9C27B0" },
  major7: { name: "Major 7", formula: "1-3-5-7", intervals: [0, 4, 7, 11], color: "#4CAF50" },
  minor7: { name: "Minor 7", formula: "1-♭3-5-♭7", intervals: [0, 3, 7, 10], color: "#2196F3" },
  dominant7: { name: "Dominant 7", formula: "1-3-5-♭7", intervals: [0, 4, 7, 10], color: "#FF5722" },
  diminished7: { name: "Diminished 7", formula: "1-♭3-♭5-♭♭7", intervals: [0, 3, 6, 9], color: "#FF9800" },
  halfDiminished7: { name: "Half Diminished 7", formula: "1-♭3-♭5-♭7", intervals: [0, 3, 6, 10], color: "#795548" },
  major9: { name: "Major 9", formula: "1-3-5-7-9", intervals: [0, 4, 7, 11, 14], color: "#4CAF50" },
  minor9: { name: "Minor 9", formula: "1-♭3-5-♭7-9", intervals: [0, 3, 7, 10, 14], color: "#2196F3" },
  sus2: { name: "Suspended 2nd", formula: "1-2-5", intervals: [0, 2, 7], color: "#00BCD4" },
  sus4: { name: "Sus4", formula: "1-4-5", intervals: [0, 5, 7], color: "#00BCD4" },
  add9: { name: "Add9", formula: "1-3-5-9", intervals: [0, 4, 7, 14], color: "#4CAF50" },
  power: { name: "Power Chord", formula: "1-5", intervals: [0, 7], color: "#E91E63" },
} as const

// Note names and their positions
const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

interface PianoChordCompassProps {
  positionY: number
  height: number
}

export const PianoChordCompass: React.FC<PianoChordCompassProps> = ({ positionY, height }) => {
  const navigation = useNavigation()

  const handleOpenChordCompass = () => {
    navigation.navigate("ChordCompass" as never)
  }

  return (
    <View style={styles.container}>
      {/* Card Content */}
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIcon}>
            <Ionicons name="musical-notes" size={32} color={Colors.primary} />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Chord Compass</Text>
            <Text style={styles.cardDescription}>
              Interactive chord builder with piano visualization
            </Text>
          </View>
        </View>
        
        {/* Preview Image or Icon */}
        <View style={styles.previewSection}>
          <View style={styles.pianoPreview}>
            <View style={styles.previewKeys}>
              {Array.from({ length: 8 }, (_, i) => (
                <View
                  key={i}
                  style={[
                    styles.previewKey,
                    i % 2 === 0 ? styles.previewWhiteKey : styles.previewBlackKey
                  ]}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Open Button */}
        <Pressable 
          style={styles.openButton}
          onPress={handleOpenChordCompass}
        >
          <Text style={styles.openButtonText}>Open Chord Compass</Text>
          <Ionicons name="arrow-forward" size={20} color={Colors.primary} />
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  cardContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
  },
  previewSection: {
    marginBottom: 15,
  },
  pianoPreview: {
    flexDirection: "row",
    height: 50,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    overflow: "hidden",
  },
  previewKeys: {
    flexDirection: "row",
  },
  previewKey: {
    width: 30,
    height: "100%",
  },
  previewWhiteKey: {
    backgroundColor: "#fff",
    borderRightWidth: 1,
    borderRightColor: "#ccc",
  },
  previewBlackKey: {
    backgroundColor: "#000",
    marginLeft: -10,
    marginRight: -10,
    zIndex: 1,
  },
  openButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 10,
  },
  openButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
}) 