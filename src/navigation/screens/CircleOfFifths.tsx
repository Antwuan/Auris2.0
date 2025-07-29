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

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("circle_of_fifths")}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.circleContainer}>
          <View style={styles.circleCenter}>
            <Text style={styles.circleCenterText}>KEY</Text>
          </View>
          
          {CIRCLE_OF_FIFTHS.slice(0, 12).map((keyData, index) => {
            const angle = (index * 30) - 90 // Start from top
            const radius = 120
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

        {/* Additional Information */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>How to Use:</Text>
          <Text style={styles.infoText}>
            • Clockwise movement adds sharps (G, D, A, E, B, F#, C#)
          </Text>
          <Text style={styles.infoText}>
            • Counterclockwise movement adds flats (F, Bb, Eb, Ab, Db, Gb, Cb)
          </Text>
          <Text style={styles.infoText}>
            • Related keys are adjacent in the circle
          </Text>
          <Text style={styles.infoText}>
            • Perfect for understanding key signatures and chord progressions
          </Text>
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
    padding: 20,
    alignItems: "center",
  },
  circleContainer: {
    width: 280,
    height: 280,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  circleCenter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(58, 58, 58, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  circleCenterText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  circleKey: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  circleKeyText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
  },
  circleKeyInfo: {
    fontSize: 10,
    marginTop: 2,
    color: Colors.secondary,
  },
  description: {
    color: Colors.secondary,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  infoSection: {
    backgroundColor: Colors.bgActive,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    width: "100%",
  },
  infoTitle: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  infoText: {
    color: Colors.secondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
}) 