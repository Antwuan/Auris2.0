import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/Colors';

interface Interval {
  name: string;
  shortName: string;
  semitones: number;
  description: string;
}

interface Note {
  name: string;
  frequency: number;
}

const IntervalTrainingScreen = () => {
  const navigation = useNavigation();
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [currentInterval, setCurrentInterval] = useState<Interval | null>(null);
  const [rootNote, setRootNote] = useState<Note | null>(null);
  const [direction, setDirection] = useState<'ascending' | 'descending' | 'both'>('ascending');
  const [selectedInterval, setSelectedInterval] = useState<string>('');
  const [selectedIntervals, setSelectedIntervals] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentQuestionDirection, setCurrentQuestionDirection] = useState<'ascending' | 'descending'>('ascending');

  // Available intervals with short names
  const intervals: Interval[] = [
    { name: 'Perfect Unison', shortName: 'Unison', semitones: 0, description: 'Same note' },
    { name: 'Minor Second', shortName: 'Min 2nd', semitones: 1, description: 'Half step' },
    { name: 'Major Second', shortName: 'Maj 2nd', semitones: 2, description: 'Whole step' },
    { name: 'Minor Third', shortName: 'Min 3rd', semitones: 3, description: 'Three half steps' },
    { name: 'Major Third', shortName: 'Maj 3rd', semitones: 4, description: 'Four half steps' },
    { name: 'Perfect Fourth', shortName: 'Perf 4th', semitones: 5, description: 'Five half steps' },
    { name: 'Perfect Fifth', shortName: 'Perf 5th', semitones: 7, description: 'Seven half steps' },
    { name: 'Minor Sixth', shortName: 'Min 6th', semitones: 8, description: 'Eight half steps' },
    { name: 'Major Sixth', shortName: 'Maj 6th', semitones: 9, description: 'Nine half steps' },
    { name: 'Minor Seventh', shortName: 'Min 7th', semitones: 10, description: 'Ten half steps' },
    { name: 'Major Seventh', shortName: 'Maj 7th', semitones: 11, description: 'Eleven half steps' },
    { name: 'Perfect Octave', shortName: 'Octave', semitones: 12, description: 'Twelve half steps' },
  ];

  // Available notes (C4 to C6 range to match the audio files)
  const notes: Note[] = [
    { name: 'C4', frequency: 261.63 },
    { name: 'Db4', frequency: 277.18 },
    { name: 'D4', frequency: 293.66 },
    { name: 'Eb4', frequency: 311.13 },
    { name: 'E4', frequency: 329.63 },
    { name: 'F4', frequency: 349.23 },
    { name: 'Gb4', frequency: 369.99 },
    { name: 'G4', frequency: 392.00 },
    { name: 'Ab4', frequency: 415.30 },
    { name: 'A4', frequency: 440.00 },
    { name: 'Bb4', frequency: 466.16 },
    { name: 'B4', frequency: 493.88 },
    { name: 'C5', frequency: 523.25 },
    { name: 'Db5', frequency: 554.37 },
    { name: 'D5', frequency: 587.33 },
    { name: 'Eb5', frequency: 622.25 },
    { name: 'E5', frequency: 659.25 },
    { name: 'F5', frequency: 698.46 },
    { name: 'Gb5', frequency: 739.99 },
    { name: 'G5', frequency: 783.99 },
    { name: 'Ab5', frequency: 830.61 },
    { name: 'A5', frequency: 880.00 },
    { name: 'Bb5', frequency: 932.33 },
    { name: 'B5', frequency: 987.77 },
    { name: 'C6', frequency: 1046.50 },
  ];

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const handleIntervalToggle = (intervalName: string) => {
    setSelectedIntervals(prev => 
      prev.includes(intervalName) 
        ? prev.filter(name => name !== intervalName)
        : [...prev, intervalName]
    );
  };

  const handleStartQuiz = () => {
    if (selectedIntervals.length < 2) {
      Alert.alert('Not Enough Intervals', 'Please select at least 2 intervals to practice.');
      return;
    }
    setIsQuizMode(true);
    generateNewQuestion();
  };

  const handleBackToSettings = () => {
    setIsQuizMode(false);
    setSelectedInterval('');
    setScore({ correct: 0, total: 0 });
  };

  const generateNewQuestion = () => {
    const availableIntervals = intervals.filter(interval => selectedIntervals.includes(interval.name));
    const randomInterval = availableIntervals[Math.floor(Math.random() * availableIntervals.length)];
    const randomRootIndex = Math.floor(Math.random() * (notes.length - randomInterval.semitones));
    const rootNote = notes[randomRootIndex];
    
    // Determine the direction for this specific question
    let questionDirection: 'ascending' | 'descending';
    if (direction === 'both') {
      questionDirection = Math.random() > 0.5 ? 'ascending' : 'descending';
    } else {
      questionDirection = direction;
    }
    
    setCurrentInterval(randomInterval);
    setRootNote(rootNote);
    setSelectedInterval('');
    setCurrentQuestionDirection(questionDirection);
  };

  const playNote = async (noteName: string) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      // Static mapping of note names to audio files
      const getAudioFile = (note: string) => {
        switch (note) {
          case 'C4': return require('../../../assets/audio/C4.mp3');
          case 'Db4': return require('../../../assets/audio/Db4.mp3');
          case 'D4': return require('../../../assets/audio/D4.mp3');
          case 'Eb4': return require('../../../assets/audio/Eb4.mp3');
          case 'E4': return require('../../../assets/audio/E4.mp3');
          case 'F4': return require('../../../assets/audio/F4.mp3');
          case 'Gb4': return require('../../../assets/audio/Gb4.mp3');
          case 'G4': return require('../../../assets/audio/G4.mp3');
          case 'Ab4': return require('../../../assets/audio/Ab4.mp3');
          case 'A4': return require('../../../assets/audio/A4.mp3');
          case 'Bb4': return require('../../../assets/audio/Bb4.mp3');
          case 'B4': return require('../../../assets/audio/B4.mp3');
          case 'C5': return require('../../../assets/audio/C5.mp3');
          case 'Db5': return require('../../../assets/audio/Db5.mp3');
          case 'D5': return require('../../../assets/audio/D5.mp3');
          case 'Eb5': return require('../../../assets/audio/Eb5.mp3');
          case 'E5': return require('../../../assets/audio/E5.mp3');
          case 'F5': return require('../../../assets/audio/F5.mp3');
          case 'Gb5': return require('../../../assets/audio/Gb5.mp3');
          case 'G5': return require('../../../assets/audio/G5.mp3');
          case 'Ab5': return require('../../../assets/audio/Ab5.mp3');
          case 'A5': return require('../../../assets/audio/A5.mp3');
          case 'Bb5': return require('../../../assets/audio/Bb5.mp3');
          case 'B5': return require('../../../assets/audio/B5.mp3');
          case 'C6': return require('../../../assets/audio/C6.mp3');
          default:
            console.error('No audio file found for note:', note);
            return null;
        }
      };

      const audioFile = getAudioFile(noteName);
      if (!audioFile) {
        console.error('No audio file found for note:', noteName);
        return;
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        audioFile,
        { shouldPlay: true }
      );

      setSound(newSound);
      setIsPlaying(true);

      // Stop playing after 1 second
      setTimeout(() => {
        setIsPlaying(false);
      }, 1000);
    } catch (error) {
      console.error('Error playing note:', error);
      setIsPlaying(false);
    }
  };

  const playInterval = async () => {
    if (!currentInterval || !rootNote) return;

    const rootNoteName = rootNote.name;
    const intervalNoteIndex = notes.findIndex(n => n.name === rootNoteName) + currentInterval.semitones;
    const intervalNote = notes[intervalNoteIndex];

    if (!intervalNote) {
      console.error('Interval note not found');
      return;
    }

    // Use the consistent direction for this question
    if (currentQuestionDirection === 'ascending') {
      await playNote(rootNoteName);
      setTimeout(() => playNote(intervalNote.name), 1100);
    } else {
      await playNote(intervalNote.name);
      setTimeout(() => playNote(rootNoteName), 1100);
    }
  };

  const playGuessedInterval = async (guessedInterval: Interval) => {
    if (!rootNote) return;

    const rootNoteName = rootNote.name;
    const guessedNoteIndex = notes.findIndex(n => n.name === rootNoteName) + guessedInterval.semitones;
    const guessedNote = notes[guessedNoteIndex];

    if (!guessedNote) {
      console.error('Guessed note not found');
      return;
    }

    // Use the same direction as the current question for consistency
    if (currentQuestionDirection === 'ascending') {
      await playNote(rootNoteName);
      setTimeout(() => playNote(guessedNote.name), 1100);
    } else {
      await playNote(guessedNote.name);
      setTimeout(() => playNote(rootNoteName), 1100);
    }
  };

  const handleIntervalSelect = (intervalName: string) => {
    setSelectedInterval(intervalName);
  };

  const handleSubmit = async () => {
    if (!selectedInterval || !currentInterval) return;

    const isCorrect = selectedInterval === currentInterval.name;
    const newScore = {
      correct: score.correct + (isCorrect ? 1 : 0),
      total: score.total + 1
    };
    setScore(newScore);

    if (isCorrect) {
      const rootInfo = rootNote ? `\nRoot: ${rootNote.name} → ${currentInterval.semitones > 0 ? 
        notes[notes.findIndex(n => n.name === rootNote.name) + currentInterval.semitones]?.name : 
        rootNote.name
      }` : '';
      
      Alert.alert(
        'Correct!', 
        `Great job! That was a ${currentInterval.name}.${rootInfo}`, 
        [
        { text: 'Next', onPress: generateNewQuestion }
        ]
      );
    } else {
      const guessedInterval = intervals.find(i => i.name === selectedInterval);
      const rootInfo = rootNote ? `\nRoot: ${rootNote.name} → ${currentInterval.semitones > 0 ? 
        notes[notes.findIndex(n => n.name === rootNote.name) + currentInterval.semitones]?.name : 
        rootNote.name
      }` : '';
      
      Alert.alert(
        'Incorrect',
        `You guessed ${selectedInterval}, but it was ${currentInterval.name}.${rootInfo}`,
        [
          { 
            text: 'Hear Difference', 
            onPress: async () => {
              if (guessedInterval) {
                await playGuessedInterval(guessedInterval);
                setTimeout(() => playInterval(), 2500);
              }
            }
          },
          { text: 'Next', onPress: generateNewQuestion }
        ]
      );
    }
  };

  const handleDirectionChange = (newDirection: 'ascending' | 'descending' | 'both') => {
    setDirection(newDirection);
  };

  const renderIntervalGrid = (intervalsToShow: Interval[], onPress: (name: string) => void, selectedValue?: string, isSelectionMode: boolean = false) => {
    const rows = [];
    for (let i = 0; i < intervalsToShow.length; i += 2) {
      const row = (
        <View key={i} style={styles.intervalRow}>
          <TouchableOpacity
            style={[
              styles.intervalButton, 
              isSelectionMode 
                ? selectedIntervals.includes(intervalsToShow[i].name) && styles.selectedInterval
                : selectedValue === intervalsToShow[i].name && styles.selectedInterval
            ]}
            onPress={() => onPress(intervalsToShow[i].name)}
          >
            <Text style={[
              styles.intervalText, 
              isSelectionMode 
                ? selectedIntervals.includes(intervalsToShow[i].name) && styles.selectedIntervalText
                : selectedValue === intervalsToShow[i].name && styles.selectedIntervalText
            ]}>
              {intervalsToShow[i].shortName}
            </Text>
          </TouchableOpacity>
          {intervalsToShow[i + 1] && (
            <TouchableOpacity
              style={[
                styles.intervalButton, 
                isSelectionMode 
                  ? selectedIntervals.includes(intervalsToShow[i + 1].name) && styles.selectedInterval
                  : selectedValue === intervalsToShow[i + 1].name && styles.selectedInterval
              ]}
              onPress={() => onPress(intervalsToShow[i + 1].name)}
            >
              <Text style={[
                styles.intervalText, 
                isSelectionMode 
                  ? selectedIntervals.includes(intervalsToShow[i + 1].name) && styles.selectedIntervalText
                  : selectedValue === intervalsToShow[i + 1].name && styles.selectedIntervalText
              ]}>
                {intervalsToShow[i + 1].shortName}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      );
      rows.push(row);
    }
    return rows;
  };

  // Settings Page
  if (!isQuizMode) {
    return (
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.title}>Interval Training</Text>
            <Text style={styles.subtitle}>Configure your practice session</Text>
            
            {/* Direction Selection */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Direction</Text>
              <View style={styles.directionButtons}>
                <TouchableOpacity 
                  style={[styles.directionButton, direction === 'ascending' && styles.activeDirection]}
                  onPress={() => handleDirectionChange('ascending')}
                >
                  <Text style={[styles.directionText, direction === 'ascending' && styles.activeDirectionText]}>
                    Ascending
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.directionButton, direction === 'descending' && styles.activeDirection]}
                  onPress={() => handleDirectionChange('descending')}
                >
                  <Text style={[styles.directionText, direction === 'descending' && styles.activeDirectionText]}>
                    Descending
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.directionButton, direction === 'both' && styles.activeDirection]}
                  onPress={() => handleDirectionChange('both')}
                >
                  <Text style={[styles.directionText, direction === 'both' && styles.activeDirectionText]}>
                    Both
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Interval Selection */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Select Intervals to Practice</Text>
              <Text style={styles.sectionDescription}>
                Choose at least 2 intervals to practice
              </Text>
              <View style={styles.intervalGrid}>
                {renderIntervalGrid(intervals, handleIntervalToggle, undefined, true)}
              </View>
            </View>

            {/* Start Button */}
            <TouchableOpacity 
              style={[styles.startButton, selectedIntervals.length < 2 && styles.disabledButton]}
              onPress={handleStartQuiz}
              disabled={selectedIntervals.length < 2}
            >
              <Text style={styles.startButtonText}>
                Start Quiz ({selectedIntervals.length} intervals selected)
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Quiz Mode
  return (
    <View style={styles.container}>
      {/* Back Button */}
              <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Interval Quiz</Text>
          
          {/* Score Display */}
          <View style={styles.scoreCard}>
            <Text style={styles.scoreText}>
              Score: {score.correct}/{score.total} ({score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%)
            </Text>
          </View>

          {/* Current Question */}
          {currentInterval && rootNote && (
            <View style={styles.questionCard}>
              <Text style={styles.sectionTitle}>Listen to the interval</Text>
              <TouchableOpacity 
                style={[styles.playButton, isPlaying && styles.playingButton]}
                onPress={playInterval}
                disabled={isPlaying}
              >
                <Text style={styles.playButtonText}>
                  {isPlaying ? 'Playing...' : 'Play Interval'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Interval Selection */}
          <View style={styles.selectionCard}>
            <Text style={styles.sectionTitle}>What interval did you hear?</Text>
            <View style={styles.intervalGrid}>
              {renderIntervalGrid(
                intervals.filter(interval => selectedIntervals.includes(interval.name)),
                handleIntervalSelect,
                selectedInterval
              )}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={[styles.submitButton, !selectedInterval && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={!selectedInterval}
          >
            <Text style={styles.submitButtonText}>Submit Answer</Text>
          </TouchableOpacity>

          {/* New Question Button */}
          <TouchableOpacity 
            style={styles.newQuestionButton}
            onPress={generateNewQuestion}
          >
            <Text style={styles.newQuestionText}>New Question</Text>
          </TouchableOpacity>

          {/* Back to Settings Button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackToSettings}
          >
            <Text style={styles.backButtonText}>Back to Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgInactive,
  },

  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: Colors.primary,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: '500',
  },
  sectionCard: {
    backgroundColor: Colors.bgActive,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 15,
    textAlign: 'center',
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.secondary,
    textAlign: 'center',
    marginBottom: 15,
  },
  directionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  directionButton: {
    backgroundColor: Colors.bgInactive,
    borderRadius: 10,
    padding: 12,
    minWidth: 80,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  activeDirection: {
    backgroundColor: Colors.primary,
  },
  directionText: {
    color: Colors.secondary,
    fontWeight: '500',
  },
  activeDirectionText: {
    color: Colors.bgInactive,
  },
  intervalGrid: {
    gap: 10,
  },
  intervalRow: {
    flexDirection: 'row',
    gap: 10,
  },
  intervalButton: {
    backgroundColor: Colors.bgInactive,
    borderRadius: 10,
    padding: 15,
    borderWidth: 2,
    borderColor: 'transparent',
    flex: 1,
    alignItems: 'center',
  },
  selectedInterval: {
    borderColor: Colors.primary,
    backgroundColor: Colors.bgActive,
  },
  intervalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
  },
  selectedIntervalText: {
    color: Colors.primary,
  },
  startButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.secondary,
  },
  startButtonText: {
    color: Colors.bgInactive,
    fontWeight: '600',
    fontSize: 16,
  },
  scoreCard: {
    backgroundColor: Colors.bgActive,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  scoreText: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: '600',
  },
  questionCard: {
    backgroundColor: Colors.bgActive,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  questionText: {
    fontSize: 16,
    color: Colors.secondary,
    marginBottom: 15,
    textAlign: 'center',
  },
  playButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 15,
    minWidth: 150,
    alignItems: 'center',
  },
  playingButton: {
    backgroundColor: Colors.secondary,
  },
  playButtonText: {
    color: Colors.bgInactive,
    fontWeight: '600',
    fontSize: 16,
  },
  selectionCard: {
    backgroundColor: Colors.bgActive,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    color: Colors.bgInactive,
    fontWeight: '600',
    fontSize: 16,
  },
  newQuestionButton: {
    backgroundColor: Colors.bgActive,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  newQuestionText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1000,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bgActive,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  backButtonText: {
    color: Colors.secondary,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default IntervalTrainingScreen; 