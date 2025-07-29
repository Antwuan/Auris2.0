import React, { useState, useMemo } from "react"
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import Colors from "@/Colors"

// Common chord progressions
const COMMON_PROGRESSIONS: Record<string, {
  name: string
  chords: string[]
  description: string
  examples: string[]
}> = {
  pop: {
    name: "Pop (I-V-vi-IV)",
    chords: ["I", "V", "vi", "IV"],
    description: "The most common pop progression",
    examples: ["C-G-Am-F", "G-D-Em-C", "F-C-Dm-Bb"]
  },
  jazz: {
    name: "Jazz (ii-V-I)",
    chords: ["ii", "V", "I"],
    description: "Classic jazz progression",
    examples: ["Dm7-G7-Cmaj7", "Em7-A7-Dmaj7", "Am7-D7-Gmaj7"]
  },
  blues: {
    name: "Blues (I-IV-V)",
    chords: ["I", "IV", "V"],
    description: "12-bar blues foundation",
    examples: ["C-F-G", "G-C-D", "A-D-E"]
  },
  rock: {
    name: "Rock (I-IV-V)",
    chords: ["I", "IV", "V"],
    description: "Classic rock progression",
    examples: ["E-A-B", "A-D-E", "G-C-D"]
  },
  folk: {
    name: "Folk (I-V-vi-IV)",
    chords: ["I", "V", "vi", "IV"],
    description: "Common folk progression",
    examples: ["C-G-Am-F", "G-D-Em-C", "D-A-Bm-G"]
  },
  country: {
    name: "Country (I-IV-V)",
    chords: ["I", "IV", "V"],
    description: "Traditional country",
    examples: ["G-C-D", "C-F-G", "D-G-A"]
  },
  dooWop: {
    name: "Doo-Wop (I-vi-IV-V)",
    chords: ["I", "vi", "IV", "V"],
    description: "Classic doo-wop progression",
    examples: ["C-Am-F-G", "G-Em-C-D", "F-Dm-Bb-C"]
  },
  minor: {
    name: "Minor (i-iv-V)",
    chords: ["i", "iv", "V"],
    description: "Minor key progression",
    examples: ["Am-Dm-E", "Em-Am-B", "Dm-Gm-A"]
  },
}

// Scale degrees to chord types
const SCALE_DEGREES: Record<string, string> = {
  "I": "major",
  "ii": "minor",
  "iii": "minor",
  "IV": "major",
  "V": "major",
  "vi": "minor",
  "vii°": "diminished",
  "i": "minor",
  "iv": "minor",
}

export const ChordProgressions: React.FC = () => {
  const navigation = useNavigation()
  const [selectedProgression, setSelectedProgression] = useState<keyof typeof COMMON_PROGRESSIONS>("pop")
  const [selectedKey, setSelectedKey] = useState("C")

  const selectedProgressionData = COMMON_PROGRESSIONS[selectedProgression]

  // Calculate actual chords based on key and progression
  const progressionChords = useMemo(() => {
    const keyIndex = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"].indexOf(selectedKey)
    if (keyIndex === -1) return []

    const majorScale = [0, 2, 4, 5, 7, 9, 11] // C major scale intervals
    const scaleNotes = majorScale.map(interval => (keyIndex + interval) % 12)

    return selectedProgressionData.chords.map(degree => {
      let degreeIndex: number
      switch (degree) {
        case "I": degreeIndex = 0; break
        case "ii": degreeIndex = 1; break
        case "iii": degreeIndex = 2; break
        case "IV": degreeIndex = 3; break
        case "V": degreeIndex = 4; break
        case "vi": degreeIndex = 5; break
        case "vii°": degreeIndex = 6; break
        case "i": degreeIndex = 0; break
        case "iv": degreeIndex = 3; break
        default: degreeIndex = 0; break
      }

      const rootNote = scaleNotes[degreeIndex]
      const chordType = SCALE_DEGREES[degree] || "major"
      const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
      
      return {
        degree,
        rootNote: noteNames[rootNote],
        chordType,
        fullName: `${noteNames[rootNote]} ${chordType}`
      }
    })
  }, [selectedKey, selectedProgressionData])

  const handleProgressionSelect = (progression: keyof typeof COMMON_PROGRESSIONS) => {
    setSelectedProgression(progression)
  }

  const handleKeySelect = (key: string) => {
    setSelectedKey(key)
  }

  const handleBackPress = () => {
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <Pressable
        onPress={handleBackPress}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.primary} />
      </Pressable>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chord Progressions</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Key Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Key</Text>
          <View style={styles.keyGrid}>
            {["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"].map((key) => (
              <Pressable
                key={key}
                onPress={() => handleKeySelect(key)}
                style={[
                  styles.keyButton,
                  selectedKey === key && { backgroundColor: Colors.primary }
                ]}
              >
                <Text style={[
                  styles.keyButtonText,
                  selectedKey === key && { color: "#000" }
                ]}>
                  {key}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Progression Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Progression</Text>
          <View style={styles.progressionGrid}>
            {Object.entries(COMMON_PROGRESSIONS).map(([key, progression]) => (
              <Pressable
                key={key}
                onPress={() => handleProgressionSelect(key as keyof typeof COMMON_PROGRESSIONS)}
                style={[
                  styles.progressionButton,
                  selectedProgression === key && { backgroundColor: Colors.primary }
                ]}
              >
                <Text style={[
                  styles.progressionButtonTitle,
                  selectedProgression === key && { color: "#000" }
                ]}>
                  {progression.name}
                </Text>
                <Text style={[
                  styles.progressionButtonDescription,
                  selectedProgression === key && { color: "#000" }
                ]}>
                  {progression.description}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Current Progression Display */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Progression</Text>
          <View style={styles.progressionDisplay}>
            <Text style={styles.progressionName}>{selectedProgressionData.name}</Text>
            <Text style={styles.progressionDescription}>{selectedProgressionData.description}</Text>
            
            <View style={styles.chordSequence}>
              {progressionChords.map((chord, index) => (
                <View key={index} style={styles.chordItem}>
                  <Text style={styles.chordDegree}>{chord.degree}</Text>
                  <Text style={styles.chordName}>{chord.fullName}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Examples */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Examples in Different Keys</Text>
          <View style={styles.examplesContainer}>
            {selectedProgressionData.examples.map((example, index) => (
              <View key={index} style={styles.exampleItem}>
                <Text style={styles.exampleText}>{example}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Practice Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Practice Tips</Text>
          <View style={styles.tipsContainer}>
            <Text style={styles.tipText}>
              • Start by playing the progression slowly in the selected key
            </Text>
            <Text style={styles.tipText}>
              • Practice transitioning between chords smoothly
            </Text>
            <Text style={styles.tipText}>
              • Try different strumming patterns and rhythms
            </Text>
            <Text style={styles.tipText}>
              • Experiment with adding extensions (7ths, 9ths, etc.)
            </Text>
            <Text style={styles.tipText}>
              • Practice in different keys to improve your understanding
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgInactive,
    paddingTop: 60,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 1000,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bgActive,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  headerTitle: {
    color: Colors.primary,
    fontSize: 24,
    fontWeight: "700",
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  keyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  keyButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 40,
    alignItems: "center",
  },
  keyButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  progressionGrid: {
    gap: 12,
  },
  progressionButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  progressionButtonTitle: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  progressionButtonDescription: {
    color: Colors.secondary,
    fontSize: 14,
  },
  progressionDisplay: {
    backgroundColor: Colors.bgActive,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  progressionName: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  progressionDescription: {
    color: Colors.secondary,
    fontSize: 16,
    marginBottom: 20,
  },
  chordSequence: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    gap: 10,
  },
  chordItem: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 12,
    minWidth: 80,
  },
  chordDegree: {
    color: Colors.secondary,
    fontSize: 12,
    marginBottom: 4,
  },
  chordName: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  examplesContainer: {
    gap: 10,
  },
  exampleItem: {
    backgroundColor: Colors.bgActive,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  exampleText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  tipsContainer: {
    backgroundColor: Colors.bgActive,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  tipText: {
    color: Colors.secondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
}) 