import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Colors from '@/Colors';

const NOTE_NAMES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const NOTE_FILES: { [key: string]: any } = {
  'C4': require('../../../assets/audio/C4.mp3'),
  'D4': require('../../../assets/audio/D4.mp3'),
  'E4': require('../../../assets/audio/E4.mp3'),
  'F4': require('../../../assets/audio/F4.mp3'),
  'G4': require('../../../assets/audio/G4.mp3'),
  'A4': require('../../../assets/audio/A4.mp3'),
  'B4': require('../../../assets/audio/B4.mp3'),
};
const NOTE_LABELS = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'];

const getNoteLetter = (note: string) => note[0];

const NoteRecognitionScreen = () => {
  const navigation = useNavigation();
  const [questionNote, setQuestionNote] = useState('C4');
  const [showAnswer, setShowAnswer] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [disableButtons, setDisableButtons] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  // Play a note
  const playNote = async (note: string) => {
    try {
      if (sound) await sound.unloadAsync();
      const { sound: newSound } = await Audio.Sound.createAsync(NOTE_FILES[note]);
      setSound(newSound);
      await newSound.playAsync();
    } catch (e) {
      // handle error
    }
  };
  // Pick a new random question note (not C4)
  const pickNewQuestion = async () => {
    const options = NOTE_LABELS.filter(n => n !== 'C4');
    const random = options[Math.floor(Math.random() * options.length)];
    setQuestionNote(random);
    setShowAnswer(false);
    setFeedback('');
    setDisableButtons(false);
    // Play the question note automatically
    setTimeout(() => playNote(random), 300);
  };

  useEffect(() => {
    pickNewQuestion();
    return () => { if (sound) sound.unloadAsync(); };
    // eslint-disable-next-line
  }, []);

  const handleAnswer = (noteLetter: string) => {
    setDisableButtons(true);
    const isCorrect = getNoteLetter(questionNote) === noteLetter;
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
    if (isCorrect) {
      setFeedback('Correct!');
    } else {
      setFeedback(`Incorrect! It was ${getNoteLetter(questionNote)}`);
    }
    setShowAnswer(true);
    setTimeout(() => {
      pickNewQuestion();
    }, 1200);
  };

  const percent = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.primary} />
      </TouchableOpacity>
      
      {/* Score/Progress Tracker */}
      <View style={styles.scoreCard}>
        <Text style={styles.scoreText}>
          Score: {score.correct}/{score.total} ({percent}%)
        </Text>
      </View>
      {/* Question Note */}
      <View style={styles.audioBar}>
        <TouchableOpacity onPress={() => playNote(questionNote)}>
          <Ionicons name="volume-high" size={28} color={Colors.primary} />
        </TouchableOpacity>
        <View style={styles.audioTextContainer}>
          <Text style={styles.audioLabel}>Question Note</Text>
          <Text style={styles.audioNote}>
            {showAnswer ? getNoteLetter(questionNote) : '?'}
          </Text>
        </View>
      </View>
      {/* Reference Note */}
      <View style={styles.audioBar}>
        <TouchableOpacity onPress={() => playNote('C4')}>
          <Ionicons name="volume-high" size={28} color={Colors.primary} />
        </TouchableOpacity>
        <View style={styles.audioTextContainer}>
          <Text style={styles.audioLabel}>Reference Note</Text>
          <Text style={styles.audioNote}>C</Text>
        </View>
      </View>
      {/* Answer Grid */}
      <View style={styles.grid}>
        {NOTE_NAMES.map((note, i) => (
          <TouchableOpacity
            key={note}
            style={styles.gridBtn}
            onPress={() => handleAnswer(note)}
            disabled={disableButtons}
          >
            <Text style={styles.gridBtnText}>{note}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Feedback */}
      {!!feedback && <Text style={styles.feedback}>{feedback}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgInactive,
    padding: 16,
    justifyContent: 'center',
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
  scoreCard: {
    backgroundColor: Colors.bgActive,
    borderRadius: 15,
    padding: 15,
    marginBottom: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  scoreText: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: '600',
  },
  audioBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgActive,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  audioTextContainer: {
    flex: 1,
    marginLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  audioLabel: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  audioNote: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    width: 24,
    textAlign: 'center',
    marginLeft: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 18,
    marginBottom: 8,
  },
  gridBtn: {
    width: '30%',
    aspectRatio: 1.8,
    backgroundColor: Colors.bgActive,
    borderRadius: 10,
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    borderWidth: 1.5,
    borderColor: Colors.secondary,
  },
  gridBtnText: {
    fontSize: 22,
    color: Colors.primary,
    fontWeight: '500',
  },
  feedback: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 10,
  },
});

export default NoteRecognitionScreen; 