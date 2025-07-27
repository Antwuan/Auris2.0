import React, { useState } from "react"
import { View, Text, Pressable, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import Colors from "@/Colors"

export function Home() {
  const navigation = useNavigation()
  const [activeTab, setActiveTab] = useState("home")

  const handleTonusVivoPress = () => {
    navigation.navigate("Tuneo" as never)
  }

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName)
    
    // Handle navigation for different tabs
    switch (tabName) {
      case "tuner":
        navigation.navigate("Tuneo" as never)
        break
      case "metronome":
        // TODO: Navigate to metronome screen
        console.log("Metronome coming soon!")
        break
      case "lessons":
        navigation.navigate("Lessons" as never)
        break
      default:
        // Stay on home screen
        break
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Auris</Text>
        <Text style={styles.subtitle}>Your Music Companion</Text>
      </View>
      
      <View style={styles.content}>
        <Pressable style={styles.card} onPress={handleTonusVivoPress}>
          <View style={styles.cardContent}>
            <View style={styles.cardIcon}>
              <Ionicons name="musical-note" size={40} color={Colors.primary} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Tonus Vivo</Text>
              <Text style={styles.cardDescription}>Precision tuning for your instruments</Text>
            </View>
            <View style={styles.cardArrow}>
              <Ionicons name="chevron-forward" size={24} color={Colors.secondary} />
            </View>
          </View>
        </Pressable>
      </View>
      
      {/* Floating Navigation Bar */}
      <View style={styles.floatingNav}>
        <Pressable
          style={[styles.navItem, activeTab === "home" && styles.navItemActive]}
          onPress={() => handleTabPress("home")}
        >
          <Ionicons 
            name="home" 
            size={24} 
            color={activeTab === "home" ? Colors.primary : Colors.secondary} 
          />
          <Text style={[styles.navLabel, activeTab === "home" && styles.navLabelActive]}>
            Home
          </Text>
        </Pressable>
        
        <Pressable
          style={[styles.navItem, activeTab === "tuner" && styles.navItemActive]}
          onPress={() => handleTabPress("tuner")}
        >
          <Ionicons 
            name="musical-note" 
            size={24} 
            color={activeTab === "tuner" ? Colors.primary : Colors.secondary} 
          />
          <Text style={[styles.navLabel, activeTab === "tuner" && styles.navLabelActive]}>
            Tuner
          </Text>
        </Pressable>
        
        <Pressable
          style={[styles.navItem, activeTab === "metronome" && styles.navItemActive]}
          onPress={() => handleTabPress("metronome")}
        >
          <Ionicons 
            name="timer" 
            size={24} 
            color={activeTab === "metronome" ? Colors.primary : Colors.secondary} 
          />
          <Text style={[styles.navLabel, activeTab === "metronome" && styles.navLabelActive]}>
            Metronome
          </Text>
        </Pressable>
        
        <Pressable
          style={[styles.navItem, activeTab === "lessons" && styles.navItemActive]}
          onPress={() => handleTabPress("lessons")}
        >
          <Ionicons 
            name="school" 
            size={24} 
            color={activeTab === "lessons" ? Colors.primary : Colors.secondary} 
          />
          <Text style={[styles.navLabel, activeTab === "lessons" && styles.navLabelActive]}>
            Lessons
          </Text>
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
  header: {
    paddingTop: 60,
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
    paddingBottom: 120, // Add padding to avoid floating nav
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
  floatingNav: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: Colors.bgActive,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.secondary,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  navItem: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    minWidth: 60,
  },
  navItemActive: {
    backgroundColor: Colors.bgInactive,
  },
  navLabel: {
    fontSize: 12,
    color: Colors.secondary,
    marginTop: 4,
    fontWeight: "500",
  },
  navLabelActive: {
    color: Colors.primary,
    fontWeight: "600",
  },
}) 