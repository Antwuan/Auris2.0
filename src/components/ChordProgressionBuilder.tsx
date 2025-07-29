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
}> = {
  pop: {
    name: "Pop (I-V-vi-IV)",
    chords: ["I", "V", "vi", "IV"],
    description: "The most common pop progression"
  },
  jazz: {
    name: "Jazz (ii-V-I)",
    chords: ["ii", "V", "I"],
    description: "Classic jazz progression"
  },
  blues: {
    name: "Blues (I-IV-V)",
    chords: ["I", "IV", "V"],
    description: "12-bar blues foundation"
  },
  rock: {
    name: "Rock (I-IV-V)",
    chords: ["I", "IV", "V"],
    description: "Classic rock progression"
  },
  folk: {
    name: "Folk (I-V-vi-IV)",
    chords: ["I", "V", "vi", "IV"],
    description: "Common folk progression"
  },
  country: {
    name: "Country (I-IV-V)",
    chords: ["I", "IV", "V"],
    description: "Traditional country"
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
}

interface ChordProgressionBuilderProps {
  positionY: number
  height: number
}

export const ChordProgressionBuilder: React.FC<ChordProgressionBuilderProps> = ({ positionY, height }) => {
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

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Key Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.keyScroll}>
            {["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"].map((key) => (
              <Pressable
                key={key}
                onPress={() => handleKeySelect(key)}
                style={[
                  styles.keyButton,
                  selectedKey === key && styles.selectedKeyButton,
                ]}
              >
                <Text style={[
                  styles.keyText,
                  selectedKey === key && styles.selectedKeyText,
                ]}>
                  {key}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Progression Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Common Progressions</Text>
          <View style={styles.progressionGrid}>
            {Object.entries(COMMON_PROGRESSIONS).map(([key, progression]) => (
              <Pressable
                key={key}
                onPress={() => handleProgressionSelect(key as keyof typeof COMMON_PROGRESSIONS)}
                style={[
                  styles.progressionButton,
                  selectedProgression === key && styles.selectedProgressionButton,
                ]}
              >
                <Text style={[
                  styles.progressionName,
                  selectedProgression === key && styles.selectedProgressionName,
                ]}>
                  {progression.name}
                </Text>
                <Text style={[
                  styles.progressionChords,
                  selectedProgression === key && styles.selectedProgressionChords,
                ]}>
                  {progression.chords.join(" - ")}
                </Text>
                <Text style={[
                  styles.progressionDescription,
                  selectedProgression === key && styles.selectedProgressionDescription,
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
          <View style={styles.progressionContainer}>
            <Text style={styles.progressionTitle}>
              {selectedKey} {selectedProgressionData.name}
            </Text>
            <Text style={styles.progressionDescription}>
              {selectedProgressionData.description}
            </Text>
            
            <View style={styles.chordsContainer}>
              {progressionChords.map((chord, index) => (
                <View key={index} style={styles.chordItem}>
                  <Text style={styles.chordDegree}>{chord.degree}</Text>
                  <Text style={styles.chordName}>{chord.fullName}</Text>
                  <Text style={styles.chordRoot}>{chord.rootNote}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Practice Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Practice Tips</Text>
          <View style={styles.tipsContainer}>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
              <Text style={styles.tipText}>
                Practice each chord individually before playing the progression
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
              <Text style={styles.tipText}>
                Start slowly and gradually increase tempo
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
              <Text style={styles.tipText}>
                Try different strumming patterns
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
              <Text style={styles.tipText}>
                Experiment with chord voicings and inversions
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
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
  scrollContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  keyScroll: {
    flexDirection: "row",
  },
  keyButton: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    minWidth: 50,
    alignItems: "center",
  },
  selectedKeyButton: {
    backgroundColor: "rgba(58, 58, 58, 0.8)",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  keyText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  selectedKeyText: {
    color: Colors.primary,
  },
  progressionGrid: {
    gap: 12,
  },
  progressionButton: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    padding: 12,
  },
  selectedProgressionButton: {
    backgroundColor: "rgba(58, 58, 58, 0.8)",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  progressionName: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  selectedProgressionName: {
    color: Colors.primary,
  },
  progressionChords: {
    color: Colors.secondary,
    fontSize: 14,
    marginTop: 4,
  },
  selectedProgressionChords: {
    color: Colors.primary,
    opacity: 0.8,
  },
  progressionDescription: {
    color: Colors.secondary,
    fontSize: 12,
    marginTop: 4,
  },
  selectedProgressionDescription: {
    color: Colors.primary,
    opacity: 0.6,
  },
  progressionContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
  },
  progressionTitle: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  chordsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  chordItem: {
    alignItems: "center",
    flex: 1,
  },
  chordDegree: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: "700",
  },
  chordName: {
    color: Colors.secondary,
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },
  chordRoot: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },
  tipsContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: Colors.secondary,
    lineHeight: 20,
    flex: 1,
  },
}) 