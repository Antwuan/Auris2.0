import Colors from "@/Colors"
import { Instrument } from "@/instruments"
import { getTuningFreq, InstrumentType, TuningType, GuitarTuningType, GUITAR_TUNINGS, useConfigStore } from "@/stores/configStore"
import { FontAwesome5, Ionicons } from "@expo/vector-icons"
import { Platform, Pressable, Text, useWindowDimensions, View, Modal, ScrollView, StyleSheet } from "react-native"
import { Picker } from "./Picker"
import { MenuAction } from "@react-native-menu/menu"
import { useMemo, useState } from "react"
import { useTranslation } from "@/configHooks"

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

export const RightButtons = ({
  positionY,
  instrument,
}: {
  positionY: number
  instrument: Instrument
}) => {
  const { height, width } = useWindowDimensions()
  const manual = useConfigStore((state) => state.manual)
  const setManual = useConfigStore((state) => state.setManual)
  const setInstrument = useConfigStore((state) => state.setInstrument)
  const setTuning = useConfigStore((state) => state.setTuning)
  const tuning = useConfigStore((state) => state.tuning)
  const guitarTuning = useConfigStore((state) => state.guitarTuning)
  const setGuitarTuning = useConfigStore((state) => state.setGuitarTuning)
  const [isTuningModalVisible, setIsTuningModalVisible] = useState(false)
  const t = useTranslation()
  const btnW = width / 7
  const fontHeight = height / 70
  const fontSize = fontHeight / 1.3
  const btnBorder = 1
  const btnSpacing = 10

  const instruments: MenuAction[] = useMemo(() => {
    const subactions = [
      {
        id: "chromatic", // Must be InstrumentType
        title: t("chromatic"),
        displayInline: true,
      },
      {
        id: "guitar", // Must be InstrumentType,
        title: t("guitar"),
        displayInline: true,
      },
    ]
    // Avoid nested menus in android (collapsed by default)
    return Platform.OS === "android"
      ? subactions
      : [
          {
            id: "instrument",
            title: t("mode"),
            displayInline: true,
            subactions,
          },
        ]
  }, [t])

  const tunings: MenuAction[] = useMemo(() => {
    const subactions = [
      {
        id: "ref_440" as TuningType, // NOTE: not typechecked
        title: t("tuning_440"),
        displayInline: true,
      },
      {
        id: "ref_432" as TuningType, // NOTE: not typechecked
        title: t("tuning_432"),
        displayInline: true,
      },
      {
        id: "ref_444" as TuningType, // NOTE: not typechecked
        title: t("tuning_444"),
        displayInline: true,
      },
    ]
    // Avoid nested menus in android (collapsed by default)
    return Platform.OS === "android"
      ? subactions
      : [
          {
            id: "tuning-type",
            title: t("reference_a4"),
            displayInline: true,
            subactions,
          },
        ]
  }, [t])

  const handleTuningSelect = (tuning: GuitarTuningType) => {
    setGuitarTuning(tuning)
    setIsTuningModalVisible(false)
  }

  const currentTuningDisplay = TUNING_DISPLAY_NAMES[guitarTuning]

  return (
    <>
      <View
        style={{
          position: "absolute",
          top: positionY + 10,
          right: btnSpacing,
          gap: btnSpacing,
        }}
      >
        <Picker
          actions={instruments}
          onSelect={(value) => setInstrument(value as InstrumentType)}
          value={instrument.name}
        >
          <View
            style={{
              marginLeft: btnSpacing,
              width: btnW,
              height: btnW,
              borderRadius: 10,
              backgroundColor: Colors.bgActive,
              borderColor: Colors.secondary,
              borderWidth: btnBorder,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {instrument.name === "guitar" && (
              <FontAwesome5 color={Colors.primary} size={2 * fontHeight} name="guitar" />
            )}
            {instrument.name === "chromatic" && (
              <Ionicons color={Colors.primary} size={2 * fontHeight} name="musical-note" />
            )}
          </View>
        </Picker>
        
        {instrument.hasStrings && (
          <Pressable
            onPress={() => setManual(!manual)}
            style={{
              marginLeft: btnSpacing,
              width: btnW,
              borderRadius: 10,
              backgroundColor: manual ? Colors.bgActive : Colors.secondary,
              borderColor: manual ? Colors.secondary : Colors.accent,
              borderWidth: btnBorder,
              justifyContent: "center",
              paddingVertical: 10,
              gap: 3,
            }}
          >
            <Text
              style={{
                color: Colors.primary,
                fontSize: fontSize * 0.8,
                textAlign: "center",
              }}
            >
              {t("gtr_string")}
            </Text>
            <Text
              style={{
                color: manual ? Colors.warn : Colors.ok,
                fontSize: fontSize,
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              {manual ? "MANUAL" : "AUTO"}
            </Text>
          </Pressable>
        )}

        {/* Guitar Tuning Selector - only show for guitar instrument */}
        {instrument.name === "guitar" && (
          <Pressable
            onPress={() => setIsTuningModalVisible(true)}
            style={{
              marginLeft: btnSpacing,
              width: btnW,
              borderRadius: 10,
              backgroundColor: Colors.bgActive,
              borderColor: Colors.secondary,
              borderWidth: btnBorder,
              justifyContent: "center",
              paddingVertical: 10,
              gap: 3,
            }}
          >
            <Text
              style={{
                color: Colors.primary,
                fontSize: fontSize * 0.8,
                textAlign: "center",
              }}
            >
              {t("tuning")}
            </Text>
            <Text
              style={{
                color: Colors.ok,
                fontSize: fontSize * 0.7,
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              {currentTuningDisplay}
            </Text>
          </Pressable>
        )}

        <Picker actions={tunings} onSelect={(value) => setTuning(value as TuningType)} value={tuning}>
          <View
            style={{
              marginLeft: btnSpacing,
              width: btnW,
              borderRadius: 10,
              backgroundColor: Colors.bgActive,
              borderColor: Colors.secondary,
              borderWidth: btnBorder,
              justifyContent: "center",
              paddingVertical: 10,
              gap: 3,
            }}
          >
            <Text
              style={{
                color: Colors.primary,
                fontSize: fontSize * 0.8,
                textAlign: "center",
              }}
            >
              {t("reference")}
            </Text>
            <Text
              style={{
                color: tuning === "ref_440" ? Colors.ok : Colors.warn,
                fontSize: fontSize,
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              {getTuningFreq(tuning)}Hz
            </Text>
          </View>
        </Picker>
      </View>

      {/* Tuning Selection Modal */}
      <Modal
        visible={isTuningModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsTuningModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t("select_tuning")}</Text>
              <Pressable
                onPress={() => setIsTuningModalVisible(false)}
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
