import React from "react"
import { View, Text, StyleSheet, Pressable } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import Colors from "@/Colors"
import { useTranslation } from "@/configHooks"

// Circle of fifths data
const CIRCLE_OF_FIFTHS = [
  { key: "C", sharps: 0, flats: 0, position: 0 },
  { key: "G", sharps: 1, flats: 0, position: 1 },
  { key: "D", sharps: 2, flats: 0, position: 2 },
  { key: "A", sharps: 3, flats: 0, position: 3 },
  { key: "E", sharps: 4, flats: 0, position: 4 },
  { key: "B", sharps: 5, flats: 0, position: 5 },
  { key: "F#", sharps: 6, flats: 0, position: 6 },
  { key: "C#", sharps: 7, flats: 0, position: 7 },
  { key: "F", sharps: 0, flats: 1, position: 8 },
  { key: "Bb", sharps: 0, flats: 2, position: 9 },
  { key: "Eb", sharps: 0, flats: 3, position: 10 },
  { key: "Ab", sharps: 0, flats: 4, position: 11 },
  { key: "Db", sharps: 0, flats: 5, position: 12 },
  { key: "Gb", sharps: 0, flats: 6, position: 13 },
  { key: "Cb", sharps: 0, flats: 7, position: 14 },
] as const

export const CircleOfFifths: React.FC = () => {
  const navigation = useNavigation()
  const t = useTranslation()

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

      <Text style={styles.title}>{t("circle_of_fifths")}</Text>
      
      <View style={styles.circleContainer}>
        <View style={styles.circleCenter}>
          <Text style={styles.circleCenterText}>KEY</Text>
        </View>
        
        {CIRCLE_OF_FIFTHS.slice(0, 12).map((keyData, index) => {
          const angle = (index * 30) - 90 // Start from top
          const radius = 80
          const x = Math.cos(angle * Math.PI / 180) * radius
          const y = Math.sin(angle * Math.PI / 180) * radius
          
          return (
            <View
              key={keyData.key}
              style={[
                styles.circleKey,
                {
                  transform: [{ translateX: x }, { translateY: y }],
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              ]}
            >
              <Text style={styles.circleKeyText}>
                {keyData.key}
              </Text>
              <Text style={styles.circleKeyInfo}>
                {keyData.sharps > 0 ? `${keyData.sharps}♯` : keyData.flats > 0 ? `${keyData.flats}♭` : 'Nat'}
              </Text>
            </View>
          )
        })}
      </View>

      <Text style={styles.description}>
        The Circle of Fifths shows the relationship between keys. Moving clockwise adds sharps, counterclockwise adds flats.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    position: "relative",
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
  title: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
    marginTop: 20,
  },
  circleContainer: {
    width: 200,
    height: 200,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  circleCenter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(58, 58, 58, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  circleCenterText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  circleKey: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  circleKeyText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.primary,
  },
  circleKeyInfo: {
    fontSize: 8,
    marginTop: 1,
    color: Colors.secondary,
  },
  description: {
    color: Colors.secondary,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
}) 