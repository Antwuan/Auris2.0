import React from "react"
import { View, Text, Pressable, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import Colors from "@/Colors"

export function Lessons() {
  const navigation = useNavigation()

  const handleNoteRecognitionPress = () => {
    navigation.navigate("NoteRecognition" as never)
  }

  const handleIntervalTrainingPress = () => {
    navigation.navigate("IntervalTraining" as never)
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

      <View style={styles.header}>
        <Text style={styles.title}>Music Lessons</Text>
        <Text style={styles.subtitle}>Improve your musical skills</Text>
      </View>
      
      <View style={styles.content}>
        <Pressable style={styles.card} onPress={handleNoteRecognitionPress}>
          <View style={styles.cardContent}>
            <View style={styles.cardIcon}>
              <Ionicons name="musical-notes" size={40} color={Colors.primary} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Note Recognition</Text>
              <Text style={styles.cardDescription}>Learn to identify musical notes by ear</Text>
            </View>
            <View style={styles.cardArrow}>
              <Ionicons name="chevron-forward" size={24} color={Colors.secondary} />
            </View>
          </View>
        </Pressable>

        <Pressable style={styles.card} onPress={handleIntervalTrainingPress}>
          <View style={styles.cardContent}>
            <View style={styles.cardIcon}>
              <Ionicons name="ear" size={40} color={Colors.primary} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Interval Ear Training</Text>
              <Text style={styles.cardDescription}>Master the distance between notes</Text>
            </View>
            <View style={styles.cardArrow}>
              <Ionicons name="chevron-forward" size={24} color={Colors.secondary} />
            </View>
          </View>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgInactive,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1000,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingTop: 100,
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.secondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  card: {
    backgroundColor: Colors.bgActive,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.secondary,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.bgInactive,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.secondary,
  },
  cardArrow: {
    marginLeft: 8,
  },
}) 