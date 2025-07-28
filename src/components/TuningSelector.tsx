import React, { useState } from "react"
import { View, Text, Pressable, Modal, ScrollView, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Colors from "@/Colors"
import { GuitarTuningType, GUITAR_TUNINGS, useConfigStore } from "@/stores/configStore"
import { useTranslation } from "@/configHooks"

interface TuningSelectorProps {
  positionY: number
  height: number
}

const TUNING_DISPLAY_NAMES: Record<GuitarTuningType, string> = {
  standard: "Standard",
  dropD: "Drop D",
  dropDSharp: "D# Standard",
  dStandard: "D Standard",
  cSharpStandard: "C# Standard",
  dropC: "Drop C",
  openE7: "Open E7",
  openEMinor7: "Open E Minor7",
}

export const TuningSelector: React.FC<TuningSelectorProps> = ({ positionY, height }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const guitarTuning = useConfigStore((state) => state.guitarTuning)
  const setGuitarTuning = useConfigStore((state) => state.setGuitarTuning)
  const t = useTranslation()

  const handleTuningSelect = (tuning: GuitarTuningType) => {
    setGuitarTuning(tuning)
    setIsModalVisible(false)
  }

  const currentTuningDisplay = TUNING_DISPLAY_NAMES[guitarTuning]

  return (
    <>
      {/* Tuning Button */}
      <Pressable
        onPress={() => setIsModalVisible(true)}
        style={[
          styles.tuningButton,
          {
            position: "absolute",
            bottom: 20,
            right: 20,
            zIndex: 1000,
          },
        ]}
      >
        <View style={styles.buttonContent}>
          <Ionicons name="musical-notes" size={20} color={Colors.primary} />
          <Text style={styles.buttonText}>{currentTuningDisplay}</Text>
        </View>
      </Pressable>

      {/* Tuning Selection Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t("select_tuning")}</Text>
              <Pressable
                onPress={() => setIsModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={Colors.primary} />
              </Pressable>
            </View>

            <ScrollView style={styles.tuningList} showsVerticalScrollIndicator={false}>
              {Object.entries(GUITAR_TUNINGS).map(([key, tuningString]) => {
                const tuningKey = key as GuitarTuningType
                const isSelected = tuningKey === guitarTuning
                
                return (
                  <Pressable
                    key={tuningKey}
                    onPress={() => handleTuningSelect(tuningKey)}
                    style={[
                      styles.tuningOption,
                      isSelected && styles.selectedTuningOption,
                    ]}
                  >
                    <View style={styles.tuningOptionContent}>
                      <Text style={[
                        styles.tuningName,
                        isSelected && styles.selectedTuningName,
                      ]}>
                        {TUNING_DISPLAY_NAMES[tuningKey]}
                      </Text>
                      <Text style={[
                        styles.tuningNotes,
                        isSelected && styles.selectedTuningNotes,
                      ]}>
                        {tuningString}
                      </Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark" size={20} color={Colors.primary} />
                    )}
                  </Pressable>
                )
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  tuningButton: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 120,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.bgInactive,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  modalTitle: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    padding: 4,
  },
  tuningList: {
    padding: 20,
  },
  tuningOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  selectedTuningOption: {
    backgroundColor: "rgba(58, 58, 58, 0.8)",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  tuningOptionContent: {
    flex: 1,
  },
  tuningName: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  selectedTuningName: {
    color: Colors.primary,
  },
  tuningNotes: {
    color: Colors.secondary,
    fontSize: 14,
    fontFamily: "monospace",
  },
  selectedTuningNotes: {
    color: Colors.primary,
    opacity: 0.8,
  },
}) 