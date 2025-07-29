import React from "react"
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import Colors from "@/Colors"

export const MusicTheory: React.FC = () => {
  const navigation = useNavigation()

  const handleOpenChordCompass = () => {
    navigation.navigate("ChordCompass" as never)
  }

  const handleOpenCircleOfFifths = () => {
    navigation.navigate("CircleOfFifths" as never)
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
        <View style={styles.header}>
          <Text style={styles.title}>Chords & Progressions</Text>
        </View>

        <View style={styles.content}>
          {/* Chord Compass Card */}
          <Pressable
            style={styles.card}
            onPress={handleOpenChordCompass}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardIcon}>
                <Ionicons name="compass" size={24} color={Colors.primary} />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>Chord Compass</Text>
                <Text style={styles.cardDescription}>
                  Interactive chord builder with piano visualization
                </Text>
              </View>
              <View style={styles.cardArrow}>
                <Ionicons name="chevron-forward" size={24} color={Colors.secondary} />
              </View>
            </View>
          </Pressable>

          {/* Circle of Fifths Card */}
          <Pressable
            style={styles.card}
            onPress={handleOpenCircleOfFifths}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardIcon}>
                <Ionicons name="refresh-circle" size={24} color={Colors.primary} />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>Circle of Fifths</Text>
                <Text style={styles.cardDescription}>
                  Visual key relationships and chord progressions
                </Text>
              </View>
              <View style={styles.cardArrow}>
                <Ionicons name="chevron-forward" size={24} color={Colors.secondary} />
              </View>
            </View>
          </Pressable>


        </View>
      </ScrollView>
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
    backgroundColor: Colors.bgActive,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    paddingTop: 100,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  title: {
    color: Colors.primary,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  content: {
    padding: 20,
  },
  card: {
    marginBottom: 20,
    backgroundColor: Colors.bgActive,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(58, 58, 58, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.secondary,
  },
  cardArrow: {
    marginLeft: 12,
  },
}) 