import React, { useState, useMemo } from "react"
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import Colors from "@/Colors"
import { useTranslation } from "@/configHooks"

// Circle of fifths data with major and relative minor keys
const CIRCLE_OF_FIFTHS = [
  { major: "C", minor: "Am", sharps: 0, flats: 0 },
  { major: "G", minor: "Em", sharps: 1, flats: 0 },
  { major: "D", minor: "Bm", sharps: 2, flats: 0 },
  { major: "A", minor: "F#m", sharps: 3, flats: 0 },
  { major: "E", minor: "C#m", sharps: 4, flats: 0 },
  { major: "B", minor: "G#m", sharps: 5, flats: 0 },
  { major: "F#", minor: "D#m", sharps: 6, flats: 0 },
  { major: "C#", minor: "A#m", sharps: 7, flats: 0 },
  { major: "F", minor: "Dm", sharps: 0, flats: 1 },
  { major: "Bb", minor: "Gm", sharps: 0, flats: 2 },
  { major: "Eb", minor: "Cm", sharps: 0, flats: 3 },
  { major: "Ab", minor: "Fm", sharps: 0, flats: 4 },
] as const



// Chord functions
const CHORD_FUNCTIONS = {
  major: ["tonic", "supertonic", "mediant", "subdominant", "dominant", "submediant", "leading tone"],
  minor: ["tonic", "supertonic", "mediant", "subdominant", "dominant", "submediant", "subtonic"],
} as const

// Note names for building chords (including enharmonic equivalents)
const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

// Map for converting enharmonic equivalents
const KEY_MAP: Record<string, string> = {
  // Major keys
  "F#": "F#",
  "C#": "C#", 
  "Bb": "A#",
  "Eb": "D#",
  "Ab": "G#",
  "Db": "C#",
  "Gb": "F#",
  "Cb": "B",
  // Minor keys
  "Am": "A",
  "Em": "E", 
  "Bm": "B",
  "F#m": "F#",
  "C#m": "C#",
  "G#m": "G#",
  "D#m": "D#",
  "A#m": "A#",
  "Dm": "D",
  "Gm": "G",
  "Cm": "C",
  "Fm": "F"
}

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

// Function to get chord names for a given key
const getChordNames = (key: string, isMinor: boolean = false) => {
  // Convert enharmonic equivalents
  const mappedKey = KEY_MAP[key] || key
  const keyIndex = NOTE_NAMES.indexOf(mappedKey)
  if (keyIndex === -1) return []
  
  if (isMinor) {
    // Minor key chords: i, ii°, III, iv, v, VI, VII
    const intervals = [0, 2, 4, 5, 7, 9, 11]
    const qualities = ["m", "°", "", "m", "m", "", ""]
    
    return intervals.map((interval, index) => {
      const noteIndex = (keyIndex + interval) % 12
      const note = NOTE_NAMES[noteIndex]
      const quality = qualities[index]
      return note + quality
    })
  } else {
    // Major key chords: I, ii, iii, IV, V, vi, vii°
    const intervals = [0, 2, 4, 5, 7, 9, 11]
    const qualities = ["", "m", "m", "", "", "m", "°"]
    
    return intervals.map((interval, index) => {
      const noteIndex = (keyIndex + interval) % 12
      const note = NOTE_NAMES[noteIndex]
      const quality = qualities[index]
      return note + quality
    })
  }
}

export const CircleOfFifths: React.FC = () => {
  const navigation = useNavigation()
  const t = useTranslation()
  const [selectedKey, setSelectedKey] = useState("C")
  const [isMinor, setIsMinor] = useState(false)


  const handleBackPress = () => {
    navigation.goBack()
  }

  const handleKeySelect = (key: string) => {
    setSelectedKey(key)
    // Find if it's a major or minor key
    const keyData = CIRCLE_OF_FIFTHS.find(k => k.major === key || k.minor === key)
    if (keyData) {
      setIsMinor(keyData.minor === key)
    }
  }



  // Get chord names for selected key
  const chordNames = getChordNames(selectedKey, isMinor)
  const scaleDegrees = isMinor ? ["i", "ii°", "III", "iv", "v", "VI", "VII"] : ["I", "ii", "iii", "IV", "V", "vi", "vii°"]
  const chordFunctions = isMinor ? CHORD_FUNCTIONS.minor : CHORD_FUNCTIONS.major

  // Get relative key info
  const keyData = CIRCLE_OF_FIFTHS.find(k => k.major === selectedKey || k.minor === selectedKey)
  const relativeKey = keyData ? (isMinor ? keyData.major : keyData.minor) : ""
  const parallelKey = keyData ? (isMinor ? keyData.major : keyData.minor) : ""



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
        <Text style={styles.headerTitle}>{t("circle_of_fifths")}</Text>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Key Selection Buttons */}
        <View style={styles.keySelectionContainer}>
          <Text style={styles.keySelectionTitle}>Select Key:</Text>
          
          {/* Major Keys */}
          <View style={styles.keyRow}>
            <Text style={styles.keyTypeLabel}>Major Keys:</Text>
            <View style={styles.keyButtonsContainer}>
              {CIRCLE_OF_FIFTHS.map((keyData) => (
                <Pressable
                  key={`major-${keyData.major}`}
                  onPress={() => handleKeySelect(keyData.major)}
                  style={[
                    styles.keyButton,
                    {
                      backgroundColor: selectedKey === keyData.major && !isMinor ? Colors.primary : Colors.bgActive,
                      borderColor: selectedKey === keyData.major && !isMinor ? Colors.primary : Colors.secondary,
                    },
                  ]}
                >
                  <Text style={[
                    styles.keyButtonText,
                    {
                      color: selectedKey === keyData.major && !isMinor ? Colors.bgInactive : Colors.primary,
                    },
                  ]}>
                    {keyData.major}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          
          {/* Minor Keys */}
          <View style={styles.keyRow}>
            <Text style={styles.keyTypeLabel}>Minor Keys:</Text>
            <View style={styles.keyButtonsContainer}>
              {CIRCLE_OF_FIFTHS.map((keyData) => (
                <Pressable
                  key={`minor-${keyData.minor}`}
                  onPress={() => handleKeySelect(keyData.minor)}
                  style={[
                    styles.keyButton,
                    {
                      backgroundColor: selectedKey === keyData.minor && isMinor ? Colors.primary : Colors.bgActive,
                      borderColor: selectedKey === keyData.minor && isMinor ? Colors.primary : Colors.secondary,
                    },
                  ]}
                >
                  <Text style={[
                    styles.keyButtonText,
                    {
                      color: selectedKey === keyData.minor && isMinor ? Colors.bgInactive : Colors.primary,
                    },
                  ]}>
                    {keyData.minor}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>



        {/* Chords Table */}
        <View style={styles.chordsTableContainer}>
          <Text style={styles.chordsTableTitle}>Chords in {selectedKey} {isMinor ? "minor" : "major"}</Text>
          
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Degree</Text>
            <Text style={styles.tableHeaderText}>Function</Text>
            <Text style={styles.tableHeaderText}>Chord</Text>
          </View>
          
          {/* Table Rows */}
          {scaleDegrees.map((degree, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.tableCellText}>{degree}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableCellText}>{chordFunctions[index]}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableCellText}>{chordNames[index]}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Chord Progression Notes */}
        <View style={styles.progressionNotesSection}>
          <Text style={styles.progressionNotesTitle}>Common Chord Progressions</Text>
          <View style={styles.progressionNotesGrid}>
            {Object.entries(COMMON_PROGRESSIONS).map(([key, progression]) => (
              <View key={key} style={styles.progressionNote}>
                <Text style={styles.progressionNoteTitle}>{progression.name}</Text>
                <Text style={styles.progressionNoteDescription}>{progression.description}</Text>
                <Text style={styles.progressionNoteChords}>{progression.chords.join(" - ")}</Text>
              </View>
            ))}
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    alignItems: "center",
  },
  keySelectionContainer: {
    width: "100%",
    marginBottom: 30,
  },
  keySelectionTitle: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  keyRow: {
    marginBottom: 20,
  },
  keyTypeLabel: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  keyButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  keyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    minWidth: 50,
    alignItems: "center",
  },
  keyButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  progressionSection: {
    marginBottom: 30,
  },
  progressionTitle: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },
  progressionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  progressionButton: {
    backgroundColor: Colors.bgActive,
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: Colors.secondary,
    minWidth: 120,
    alignItems: "center",
  },
  progressionButtonTitle: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
  },
  progressionButtonDescription: {
    color: Colors.secondary,
    fontSize: 12,
    textAlign: "center",
  },
  progressionDisplaySection: {
    marginBottom: 30,
  },
  progressionDisplayTitle: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
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
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  progressionDescription: {
    color: Colors.secondary,
    fontSize: 14,
    marginBottom: 15,
    textAlign: "center",
  },
  chordSequence: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    gap: 10,
  },
  chordItem: {
    alignItems: "center",
    minWidth: 60,
  },
  chordDegree: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  chordName: {
    color: Colors.secondary,
    fontSize: 12,
    textAlign: "center",
  },
  progressionNotesSection: {
    marginTop: 30,
    marginBottom: 20,
  },
  progressionNotesTitle: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },
  progressionNotesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  progressionNote: {
    backgroundColor: Colors.bgActive,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    width: 150,
    height: 90,
  },
  progressionNoteTitle: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  progressionNoteDescription: {
    color: Colors.secondary,
    fontSize: 11,
    marginBottom: 6,
    textAlign: "center",
  },
  progressionNoteChords: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  chordsTableContainer: {
    backgroundColor: Colors.bgActive,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    width: "100%",
  },
  chordsTableTitle: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },
  tableHeader: {
    flexDirection: "row",
    marginBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
    paddingBottom: 8,
  },
  tableHeaderText: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: "center",
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  tableCell: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  tableCellText: {
    color: Colors.secondary,
    fontSize: 12,
    textAlign: "center",
  },
}) 