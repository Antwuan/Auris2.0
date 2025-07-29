import React, { useState, useMemo, useRef } from "react"
import { View, Text, Pressable, StyleSheet, Dimensions, Animated } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import Colors from "@/Colors"

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")

// Piano key data - Extended keyboard for proper sliding
const PIANO_KEYS = [
  // Octave 3
  { note: "C", isBlack: false, octave: 3 },
  { note: "C#", isBlack: true, octave: 3 },
  { note: "D", isBlack: false, octave: 3 },
  { note: "D#", isBlack: true, octave: 3 },
  { note: "E", isBlack: false, octave: 3 },
  { note: "F", isBlack: false, octave: 3 },
  { note: "F#", isBlack: true, octave: 3 },
  { note: "G", isBlack: false, octave: 3 },
  { note: "G#", isBlack: true, octave: 3 },
  { note: "A", isBlack: false, octave: 3 },
  { note: "A#", isBlack: true, octave: 3 },
  { note: "B", isBlack: false, octave: 3 },
  // Octave 4
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
  // Octave 5
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
  // Octave 6
  { note: "C", isBlack: false, octave: 6 },
  { note: "C#", isBlack: true, octave: 6 },
  { note: "D", isBlack: false, octave: 6 },
  { note: "D#", isBlack: true, octave: 6 },
  { note: "E", isBlack: false, octave: 6 },
  { note: "F", isBlack: false, octave: 6 },
  { note: "F#", isBlack: true, octave: 6 },
  { note: "G", isBlack: false, octave: 6 },
  { note: "G#", isBlack: true, octave: 6 },
  { note: "A", isBlack: false, octave: 6 },
  { note: "A#", isBlack: true, octave: 6 },
  { note: "B", isBlack: false, octave: 6 },
]

// Chord formulas
const CHORD_FORMULAS = {
  major: {
    name: "Major",
    intervals: [0, 4, 7], // Root, Major 3rd, Perfect 5th
    color: "#333"
  },
  minor: {
    name: "Minor", 
    intervals: [0, 3, 7], // Root, Minor 3rd, Perfect 5th
    color: "#2196F3"
  },
  diminished: {
    name: "Diminished",
    intervals: [0, 3, 6], // Root, Minor 3rd, Diminished 5th
    color: "#FF5722"
  },
  augmented: {
    name: "Augmented",
    intervals: [0, 4, 8], // Root, Major 3rd, Augmented 5th
    color: "#9C27B0"
  },
  dominant7: {
    name: "Dominant 7th",
    intervals: [0, 4, 7, 10], // Root, Major 3rd, Perfect 5th, Minor 7th
    color: "#FF9800"
  },
  minor7: {
    name: "Minor 7th",
    intervals: [0, 3, 7, 10], // Root, Minor 3rd, Perfect 5th, Minor 7th
    color: "#4CAF50"
  },
  augmented7: {
    name: "Augmented 7th",
    intervals: [0, 4, 8, 10], // Root, Major 3rd, Augmented 5th, Minor 7th
    color: "#E91E63"
  },
  halfDiminished7: {
    name: "Half Diminished 7th",
    intervals: [0, 3, 6, 10], // Root, Minor 3rd, Diminished 5th, Minor 7th
    color: "#795548"
  },
  diminished7: {
    name: "Diminished 7th",
    intervals: [0, 3, 6, 9], // Root, Minor 3rd, Diminished 5th, Diminished 7th
    color: "#607D8B"
  },
  major7: {
    name: "Major 7th",
    intervals: [0, 4, 7, 11], // Root, Major 3rd, Perfect 5th, Major 7th
    color: "#3F51B5"
  },
  suspended2: {
    name: "Suspended 2nd",
    intervals: [0, 2, 7], // Root, Major 2nd, Perfect 5th
    color: "#009688"
  },
  suspended4: {
    name: "Suspended 4th",
    intervals: [0, 5, 7], // Root, Perfect 4th, Perfect 5th
    color: "#8BC34A"
  }
}

// Interval colors
const INTERVAL_COLORS = {
  root: "#333", // Black for root
  majorSecond: "#666", // Gray for major 2nd
  minorThird: "#2196F3", // Blue for minor 3rd (flat)
  majorThird: "#666", // Gray for major 3rd
  perfectFourth: "#666", // Gray for perfect 4th
  perfectFifth: "#666", // Gray for perfect 5th
  diminishedFifth: "#2196F3", // Blue for diminished 5th (flat)
  augmentedFifth: "#FF0000", // Red for augmented 5th (sharp)
  diminishedSeventh: "#2196F3", // Blue for diminished 7th (flat)
  minorSeventh: "#2196F3", // Blue for minor 7th (flat)
  majorSeventh: "#666", // Gray for major 7th
}

// Note names for all 12 semitones
const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

export const ChordCompass: React.FC = () => {
  const navigation = useNavigation()
  const [selectedChord, setSelectedChord] = useState<keyof typeof CHORD_FORMULAS>("major")
  const [selectedKey, setSelectedKey] = useState("C")
  const [showDropdown, setShowDropdown] = useState(false)
  const [dropdownSelection, setDropdownSelection] = useState<keyof typeof CHORD_FORMULAS | null>(null)
  const pianoOffset = useRef(new Animated.Value(0)).current

  // Find C3 (the C note closest to center of piano)
  const C3_INDEX = PIANO_KEYS.findIndex(key => key.note === "C" && key.octave === 3)
  const C3_POSITION = C3_INDEX * 35 // keyWidth = 35

  // Calculate chord notes based on selected key and chord type
  const chordNotes = useMemo(() => {
    const keyIndex = NOTE_NAMES.indexOf(selectedKey)
    const chordData = CHORD_FORMULAS[selectedChord]
    
    return chordData.intervals.map(interval => {
      const noteIndex = (keyIndex + interval) % 12
      return NOTE_NAMES[noteIndex]
    })
  }, [selectedKey, selectedChord])

  // Get highlighted keys for current chord (only first occurrence of each note)
  const highlightedKeys = useMemo(() => {
    const foundNotes = new Set<string>()
    const indices: number[] = []
    chordNotes.forEach(note => {
      const idx = PIANO_KEYS.findIndex((key, i) => key.note === note && !foundNotes.has(note))
      if (idx !== -1) {
        indices.push(idx)
        foundNotes.add(note)
      }
    })
    return indices
  }, [chordNotes])

  // Calculate indicator positions based on fixed intervals from root
  const indicatorPositions = useMemo(() => {
    const semitoneWidth = 35 / 2 // Each semitone is half a white key width
    const leftEdge = 20 // Left edge of piano container (padding)
    const keyCenter = 35 / 2 // Center of a white key
    
    // Root is always at center
    const rootPosition = leftEdge + keyCenter - 17.5
    
    // Get intervals for the selected chord
    const chordData = CHORD_FORMULAS[selectedChord]
    const intervals = chordData.intervals
    
    // Calculate actual spacing accounting for B->C and E->F transitions
    const calculateSpacing = (semitones: number) => {
      let spacing = 0
      for (let i = 0; i < semitones; i++) {
        // Check if this semitone step crosses B->C or E->F boundary
        const currentNoteIndex = i
        const nextNoteIndex = i + 1
        const currentNote = NOTE_NAMES[currentNoteIndex % 12]
        const nextNote = NOTE_NAMES[nextNoteIndex % 12]
        
        // If crossing B->C or E->F, use full key width, otherwise use semitone width
        const isSpecialTransition = (currentNote === "B" && nextNote === "C") || (currentNote === "E" && nextNote === "F")
        spacing += isSpecialTransition ? 35 : semitoneWidth
      }
      return spacing
    }
    
    // Calculate positions for all intervals in the chord
    const positions = intervals.map(interval => {
      return leftEdge + calculateSpacing(interval) + keyCenter - 17.5
    })
    
    return positions
  }, [selectedChord])





  const chordData = CHORD_FORMULAS[selectedChord]

  const handleChordSelect = (chord: keyof typeof CHORD_FORMULAS) => {
    setSelectedChord(chord)
  }

  const handleDropdownSelect = (chord: keyof typeof CHORD_FORMULAS) => {
    setDropdownSelection(chord)
    setSelectedChord(chord) // Immediately apply the chord to the piano
    setShowDropdown(false)
  }

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown)
  }

  const handlePianoSlide = (direction: 'left' | 'right') => {
    const currentIndex = NOTE_NAMES.indexOf(selectedKey)
    let newIndex
    
    if (direction === 'left') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : 0 // Stop at C
    } else {
      newIndex = currentIndex < NOTE_NAMES.length - 1 ? currentIndex + 1 : NOTE_NAMES.length - 1 // Stop at B
    }
    
    const newKey = NOTE_NAMES[newIndex]
    setSelectedKey(newKey)
    
    // Calculate the offset to move the piano
    const newRootIndex = PIANO_KEYS.findIndex(key => key.note === newKey)
    const screenCenter = screenWidth / 2
    
    // Calculate how many semitones away from C the new root is
    const cIndex = NOTE_NAMES.indexOf("C")
    const newKeyIndex = NOTE_NAMES.indexOf(newKey)
    const semitonesFromC = newKeyIndex - cIndex
    
    // Calculate the new offset based on actual key sizes
    let totalOffset = 0
    for (let i = 0; i < Math.abs(semitonesFromC); i++) {
      const currentNoteIndex = semitonesFromC > 0 ? cIndex + i : cIndex - i
      const nextNoteIndex = semitonesFromC > 0 ? cIndex + i + 1 : cIndex - i - 1
      
      const currentNote = NOTE_NAMES[currentNoteIndex % 12]
      const nextNote = NOTE_NAMES[nextNoteIndex % 12]
      
      // Check if current and next notes are both white keys (no black key between)
      const isWhiteToWhite = (currentNote === "B" && nextNote === "C") || (currentNote === "E" && nextNote === "F")
      
      // Calculate step size: white-to-white = 35px, black-to-white = 17.5px
      const stepSize = isWhiteToWhite ? 35 : 17.5
      totalOffset += stepSize
    }
    
    const newOffset = C3_POSITION - (semitonesFromC > 0 ? totalOffset : -totalOffset)
    
    // Animate the piano slide
    Animated.timing(pianoOffset, {
      toValue: newOffset,
      duration: 300,
      useNativeDriver: true,
    }).start()
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

      {/* Main Content */}
      <View style={styles.content}>
        {/* Piano Section */}
        <View style={styles.pianoSection}>
          {/* Chord Interval Labels */}
          <View style={styles.intervalLabelsContainer}>
            <Pressable onPress={() => handlePianoSlide('left')} style={styles.navArrow}>
              <Text style={styles.arrowText}>◀</Text>
            </Pressable>
            
            <View style={styles.labelsRow}>
              <View style={styles.intervalLabel}>
                <Text style={styles.intervalLabelText}>ROOT</Text>
                <View style={[styles.noteLabel, { backgroundColor: INTERVAL_COLORS.root }]}>
                  <Text style={styles.noteLabelText}>{chordNotes[0]}</Text>
                </View>
              </View>
              <View style={styles.intervalLabel}>
                <Text style={styles.intervalLabelText}>
                  {selectedChord === "minor" || selectedChord === "diminished" || selectedChord === "minor7" || selectedChord === "halfDiminished7" || selectedChord === "diminished7" ? "m3" : 
                   selectedChord === "suspended2" ? "2nd" : 
                   selectedChord === "suspended4" ? "4th" : "3rd"}
                </Text>
                <View style={[
                  styles.noteLabel, 
                  { backgroundColor: selectedChord === "minor" || selectedChord === "diminished" || selectedChord === "minor7" || selectedChord === "halfDiminished7" || selectedChord === "diminished7" ? INTERVAL_COLORS.minorThird : 
                                    selectedChord === "suspended2" || selectedChord === "suspended4" ? INTERVAL_COLORS.majorSecond : 
                                    INTERVAL_COLORS.majorThird }
                ]}>
                  <Text style={styles.noteLabelText}>{chordNotes[1]}</Text>
                </View>
              </View>
              <View style={styles.intervalLabel}>
                <Text style={styles.intervalLabelText}>
                  {selectedChord === "diminished" || selectedChord === "halfDiminished7" || selectedChord === "diminished7" ? "♭5" : 
                   selectedChord === "augmented" || selectedChord === "augmented7" ? "♯5" : "5th"}
                </Text>
                <View style={[
                  styles.noteLabel, 
                  { backgroundColor: selectedChord === "diminished" || selectedChord === "halfDiminished7" || selectedChord === "diminished7" ? INTERVAL_COLORS.diminishedFifth : 
                                    selectedChord === "augmented" || selectedChord === "augmented7" ? INTERVAL_COLORS.augmentedFifth : 
                                    INTERVAL_COLORS.perfectFifth }
                ]}>
                  <Text style={styles.noteLabelText}>{chordNotes[2]}</Text>
                </View>
              </View>
              {/* Fourth interval for 4-note chords */}
              {chordNotes.length > 3 && (
                <View style={styles.intervalLabel}>
                  <Text style={styles.intervalLabelText}>
                    {selectedChord === "diminished7" ? "♭7" : 
                     selectedChord === "major7" ? "♯7" : "7th"}
                  </Text>
                  <View style={[
                    styles.noteLabel, 
                    { backgroundColor: selectedChord === "diminished7" ? INTERVAL_COLORS.diminishedSeventh : 
                                      selectedChord === "major7" ? INTERVAL_COLORS.majorSeventh : 
                                      INTERVAL_COLORS.minorSeventh }
                  ]}>
                    <Text style={styles.noteLabelText}>{chordNotes[3]}</Text>
                  </View>
                </View>
              )}
            </View>
            
            <Pressable onPress={() => handlePianoSlide('right')} style={styles.navArrow}>
              <Text style={styles.arrowText}>▶</Text>
            </Pressable>
          </View>

          {/* Piano Container with Fixed Highlight Bars */}
          <View style={styles.pianoContainer}>
            {/* Fixed Highlight Bars - Positioned to align with chord notes */}
            <View style={styles.fixedHighlights}>
              {/* Root note highlight */}
              <View style={[
                styles.highlightBar, 
                { 
                  backgroundColor: INTERVAL_COLORS.root,
                  left: indicatorPositions[0] || screenWidth / 2,
                }
              ]} />
              {/* Second/Third note highlight */}
              <View style={[
                styles.highlightBar, 
                { 
                  backgroundColor: selectedChord === "minor" || selectedChord === "diminished" || selectedChord === "minor7" || selectedChord === "halfDiminished7" || selectedChord === "diminished7" ? INTERVAL_COLORS.minorThird : 
                                    selectedChord === "suspended2" || selectedChord === "suspended4" ? INTERVAL_COLORS.majorSecond : 
                                    INTERVAL_COLORS.majorThird,
                  left: indicatorPositions[1] || screenWidth / 2,
                }
              ]} />
              {/* Fifth note highlight */}
              <View style={[
                styles.highlightBar, 
                { 
                  backgroundColor: selectedChord === "diminished" || selectedChord === "halfDiminished7" || selectedChord === "diminished7" ? INTERVAL_COLORS.diminishedFifth : 
                                  selectedChord === "augmented" || selectedChord === "augmented7" ? INTERVAL_COLORS.augmentedFifth : 
                                  INTERVAL_COLORS.perfectFifth,
                  left: indicatorPositions[2] || screenWidth / 2,
                }
              ]} />
              {/* Seventh note highlight for 4-note chords */}
              {chordNotes.length > 3 && (
                <View style={[
                  styles.highlightBar, 
                  { 
                    backgroundColor: selectedChord === "diminished7" ? INTERVAL_COLORS.diminishedSeventh : 
                                    selectedChord === "major7" ? INTERVAL_COLORS.majorSeventh : 
                                    INTERVAL_COLORS.minorSeventh,
                    left: indicatorPositions[3] || screenWidth / 2,
                  }
                ]} />
              )}
            </View>
            
            {/* Sliding Piano Keyboard */}
            <Animated.View 
              style={[
                styles.pianoKeys,
                { transform: [{ translateX: pianoOffset }] }
              ]}
            >
              {PIANO_KEYS.map((key, index) => (
                <View
                  key={`${key.note}${key.octave}`}
                  style={[
                    styles.pianoKey,
                    key.isBlack ? styles.blackKey : styles.whiteKey,
                  ]}
                />
              ))}
            </Animated.View>
          </View>

          {/* Bottom Slider - Positioned at bottom of piano */}
          <View style={styles.bottomSlider}>
            <View style={styles.sliderTrack}>
              {/* Root indicator */}
              <View style={[
                styles.sliderIndicator, 
                { 
                  backgroundColor: INTERVAL_COLORS.root,
                  left: indicatorPositions[0] - 10 // Center the 20px indicator
                }
              ]}>
                <Text style={styles.sliderIndicatorText}>1</Text>
              </View>
              {/* Third indicator */}
              <View style={[
                styles.sliderIndicator, 
                { 
                  backgroundColor: selectedChord === "minor" || selectedChord === "diminished" ? INTERVAL_COLORS.minorThird : INTERVAL_COLORS.majorThird,
                  left: indicatorPositions[1] - 10 // Center the 20px indicator
                }
              ]}>
                <Text style={styles.sliderIndicatorText}>3</Text>
              </View>
              {/* Fifth indicator */}
              <View style={[
                styles.sliderIndicator, 
                { 
                  backgroundColor: selectedChord === "diminished" || selectedChord === "halfDiminished7" || selectedChord === "diminished7" ? INTERVAL_COLORS.diminishedFifth : 
                                  selectedChord === "augmented" || selectedChord === "augmented7" ? INTERVAL_COLORS.augmentedFifth : 
                                  INTERVAL_COLORS.perfectFifth,
                  left: indicatorPositions[2] - 10 // Center the 20px indicator
                }
              ]}>
                <Text style={styles.sliderIndicatorText}>5</Text>
              </View>
              {/* Seventh indicator for 4-note chords */}
              {chordNotes.length > 3 && (
                <View style={[
                  styles.sliderIndicator, 
                  { 
                    backgroundColor: selectedChord === "diminished7" ? INTERVAL_COLORS.diminishedSeventh : 
                                    selectedChord === "major7" ? INTERVAL_COLORS.majorSeventh : 
                                    INTERVAL_COLORS.minorSeventh,
                    left: indicatorPositions[3] - 10 // Center the 20px indicator
                  }
                ]}>
                  <Text style={styles.sliderIndicatorText}>7</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Chord Type Section */}
        <View style={styles.chordTypeSection}>
          <Text style={styles.sectionTitle}>Chord type</Text>
          
          {/* Chord Type Buttons - Stacked Vertically */}
          <View style={styles.chordTypeContainer}>
            {/* Major Chord - Always visible */}
            <View style={styles.chordTypeRow}>
              <Text style={styles.chordTypeLabel}>Major</Text>
              <Pressable
                style={[
                  styles.chordTypeButton,
                  selectedChord === "major" && styles.selectedChordTypeButton
                ]}
                onPress={() => handleChordSelect("major")}
              >
                <View style={styles.intervalButtons}>
                  {CHORD_FORMULAS.major.intervals.map((interval, index) => {
                    const isActive = selectedChord === "major" && index < 3
                    
                    return (
                      <View
                        key={index}
                        style={[
                          styles.intervalButton,
                          isActive ? styles.activeIntervalButton : styles.inactiveIntervalButton,
                        ]}
                      >
                        <Text style={[
                          styles.intervalButtonText,
                          isActive ? styles.activeIntervalButtonText : styles.inactiveIntervalButtonText
                        ]}>
                          {interval === 0 ? "1" : interval === 4 ? "3" : interval === 7 ? "5" : interval.toString()}
                        </Text>
                      </View>
                    )
                  })}
                </View>
              </Pressable>
            </View>

            {/* Minor/Diminished/Augmented Chord - Changes based on dropdown */}
            <View style={styles.chordTypeRow}>
              <Text style={styles.chordTypeLabel}>
                {dropdownSelection ? CHORD_FORMULAS[dropdownSelection].name : "Minor"}
              </Text>
              <Pressable
                style={[
                  styles.chordTypeButton,
                  (selectedChord === "minor" || selectedChord === dropdownSelection) && styles.selectedChordTypeButton
                ]}
                onPress={() => handleChordSelect(dropdownSelection || "minor")}
              >
                                  <View style={styles.intervalButtons}>
                    {(dropdownSelection ? CHORD_FORMULAS[dropdownSelection] : CHORD_FORMULAS.minor).intervals.map((interval, index) => {
                      const isActive = (selectedChord === "minor" || selectedChord === dropdownSelection) && index < (dropdownSelection ? CHORD_FORMULAS[dropdownSelection].intervals.length : 3)
                      const isMinorThird = interval === 3
                      const isDiminishedFifth = interval === 6
                      const isAugmentedFifth = interval === 8
                      const isMinorSeventh = interval === 10
                      const isMajorSeventh = interval === 11
                      const isDiminishedSeventh = interval === 9
                    
                    return (
                                              <View
                          key={index}
                          style={[
                            styles.intervalButton,
                            isActive ? styles.activeIntervalButton : styles.inactiveIntervalButton,
                            isActive && interval === 3 && styles.minorThirdButton,
                            isActive && interval === 6 && styles.diminishedButton,
                            isActive && interval === 8 && styles.augmentedButton,
                            isActive && interval === 9 && styles.diminishedButton,
                            isActive && interval === 10 && styles.minorSeventhButton,
                            isActive && interval === 11 && styles.majorSeventhButton
                          ]}
                        >
                        <Text style={[
                          styles.intervalButtonText,
                          isActive ? styles.activeIntervalButtonText : styles.inactiveIntervalButtonText
                        ]}>
                          {interval === 0 ? "1" : 
                           interval === 2 ? "2" : 
                           interval === 3 ? "♭3" : 
                           interval === 4 ? "3" : 
                           interval === 5 ? "4" : 
                           interval === 6 ? "♭5" : 
                           interval === 7 ? "5" : 
                           interval === 8 ? "♯5" : 
                           interval === 9 ? "♭7" : 
                           interval === 10 ? "7" : 
                           interval === 11 ? "♯7" : 
                           interval.toString()}
                        </Text>
                      </View>
                    )
                  })}
                </View>
              </Pressable>
            </View>
          </View>

          {/* Dropdown Button */}
          <Pressable style={styles.dropdownButton} onPress={handleDropdownToggle}>
            <Text style={styles.dropdownButtonText}>
              {dropdownSelection ? CHORD_FORMULAS[dropdownSelection].name : "Select chord type"}
            </Text>
            <Text style={styles.dropdownArrow}>{showDropdown ? "▲" : "▼"}</Text>
          </Pressable>

          {/* Dropdown Menu */}
          {showDropdown && (
            <View style={styles.dropdownMenu}>
              <Pressable 
                style={styles.dropdownItem} 
                onPress={() => handleDropdownSelect("minor")}
              >
                <Text style={styles.dropdownItemText}>Minor</Text>
              </Pressable>
              <Pressable 
                style={styles.dropdownItem} 
                onPress={() => handleDropdownSelect("diminished")}
              >
                <Text style={styles.dropdownItemText}>Diminished</Text>
              </Pressable>
              <Pressable 
                style={styles.dropdownItem} 
                onPress={() => handleDropdownSelect("augmented")}
              >
                <Text style={styles.dropdownItemText}>Augmented</Text>
              </Pressable>
              <Pressable 
                style={styles.dropdownItem} 
                onPress={() => handleDropdownSelect("dominant7")}
              >
                <Text style={styles.dropdownItemText}>Dominant 7th</Text>
              </Pressable>
              <Pressable 
                style={styles.dropdownItem} 
                onPress={() => handleDropdownSelect("minor7")}
              >
                <Text style={styles.dropdownItemText}>Minor 7th</Text>
              </Pressable>
              <Pressable 
                style={styles.dropdownItem} 
                onPress={() => handleDropdownSelect("augmented7")}
              >
                <Text style={styles.dropdownItemText}>Augmented 7th</Text>
              </Pressable>
              <Pressable 
                style={styles.dropdownItem} 
                onPress={() => handleDropdownSelect("halfDiminished7")}
              >
                <Text style={styles.dropdownItemText}>Half Diminished 7th</Text>
              </Pressable>
              <Pressable 
                style={styles.dropdownItem} 
                onPress={() => handleDropdownSelect("diminished7")}
              >
                <Text style={styles.dropdownItemText}>Diminished 7th</Text>
              </Pressable>
              <Pressable 
                style={styles.dropdownItem} 
                onPress={() => handleDropdownSelect("major7")}
              >
                <Text style={styles.dropdownItemText}>Major 7th</Text>
              </Pressable>
              <Pressable 
                style={styles.dropdownItem} 
                onPress={() => handleDropdownSelect("suspended2")}
              >
                <Text style={styles.dropdownItemText}>Suspended 2nd</Text>
              </Pressable>
              <Pressable 
                style={styles.dropdownItem} 
                onPress={() => handleDropdownSelect("suspended4")}
              >
                <Text style={styles.dropdownItemText}>Suspended 4th</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
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
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  pianoSection: {
    marginBottom: 30,
  },
  intervalLabelsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  navArrow: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  arrowText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  labelsRow: {
    flexDirection: "row",
    gap: 20,
  },
  intervalLabel: {
    alignItems: "center",
  },
  intervalLabelText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  noteLabel: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  noteLabelText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  pianoContainer: {
    height: 140,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginVertical: 10,
    position: "relative",
  },
  fixedHighlights: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  pianoKeys: {
    flexDirection: "row",
    height: "100%",
  },
  pianoKey: {
    position: "relative",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 8,
  },
  whiteKey: {
    width: 35,
    height: 120,
    backgroundColor: "#fff",
    borderRightWidth: 1,
    borderRightColor: "#ccc",
  },
  blackKey: {
    width: 24,
    height: 70,
    backgroundColor: "#000",
    marginLeft: -12,
    marginRight: -12,
    zIndex: 1,
  },
  highlightedKey: {
    position: "relative",
  },
  highlightBar: {
    position: "absolute",
    bottom: 0,
    width: 6,
    height: 90,
    marginLeft: -3,
    borderRadius: 3,
    opacity: 0.8,
  },

  bottomSlider: {
    marginTop: 8,
  },
  sliderTrack: {
    height: 20,
    backgroundColor: "#ccc",
    borderRadius: 10,
    position: "relative",
  },
  sliderIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000",
    position: "absolute",
    top: 0,
  },
  rootIndicator: {
    backgroundColor: "#000",
  },
  intervalIndicator: {
    backgroundColor: "transparent",
  },
  minorThirdIndicator: {
    backgroundColor: "#2196F3",
  },
  sliderIndicatorText: {
    fontSize: 10,
    fontWeight: "600",
  },
  chordTypeSection: {
    alignItems: "center",
  },
  sectionTitle: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  chordTypeContainer: {
    width: "100%",
    gap: 12,
  },
  chordTypeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  chordTypeLabel: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "600",
    minWidth: 60,
  },
  chordTypeButton: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    flex: 1,
    minHeight: 60,
  },
  selectedChordTypeButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderColor: Colors.primary,
  },
  chordTypeName: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  selectedChordTypeName: {
    color: Colors.primary,
    fontWeight: "700",
  },
  intervalButtons: {
    flexDirection: "row",
    gap: 4,
  },
  intervalButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000",
  },
  activeIntervalButton: {
    backgroundColor: "#333",
  },
  inactiveIntervalButton: {
    backgroundColor: "#ccc",
  },
  activeIntervalButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  inactiveIntervalButtonText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "600",
  },
  intervalButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  minorThirdButton: {
    backgroundColor: INTERVAL_COLORS.minorThird,
  },
  diminishedButton: {
    backgroundColor: INTERVAL_COLORS.diminishedFifth,
  },
  augmentedButton: {
    backgroundColor: INTERVAL_COLORS.augmentedFifth,
  },
  minorSeventhButton: {
    backgroundColor: INTERVAL_COLORS.minorSeventh,
  },
  majorSeventhButton: {
    backgroundColor: INTERVAL_COLORS.majorSeventh,
  },
  flatSymbol: {
    position: "absolute",
    right: -8,
    top: -2,
    fontSize: 8,
    color: "#000",
    fontWeight: "600",
  },
  diminishedSymbol: {
    position: "absolute",
    right: -8,
    top: -2,
    fontSize: 8,
    color: "#000",
    fontWeight: "600",
  },
  augmentedSymbol: {
    position: "absolute",
    right: -8,
    top: -2,
    fontSize: 8,
    color: "#000",
    fontWeight: "600",
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    marginTop: 20,
  },
  dropdownButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },
  dropdownArrow: {
    color: "#000",
    fontSize: 12,
  },
  dropdownMenu: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    zIndex: 10,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdownItemText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },
}) 