import React, { useState } from "react"
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import Colors from "@/Colors"

export function Home() {
  const navigation = useNavigation()
  const [activeTab, setActiveTab] = useState("home")
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName)
    
    // Handle navigation for different tabs
    switch (tabName) {
      case "tonusVivo":
        navigation.navigate("Tuneo" as never)
        break
      case "chords":
        navigation.navigate("MusicTheory" as never)
        break
      case "lessons":
        navigation.navigate("Lessons" as never)
        break
      default:
        // Stay on home screen
        break
    }
  }

  const handleSectionPress = (section: string) => {
    setActiveSection(activeSection === section ? null : section)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Auris</Text>
        <Text style={styles.subtitle}>Your Music Companion</Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome to Music Theory</Text>
          <Text style={styles.welcomeDescription}>
            Learn the fundamentals of music theory and discover essential concepts to enhance your musical journey.
          </Text>
        </View>

        {/* Music Theory Basics */}
        <View style={styles.section}>
          <Pressable
            style={styles.sectionHeader}
            onPress={() => handleSectionPress("basics")}
          >
            <View style={styles.sectionHeaderContent}>
              <View style={styles.sectionIcon}>
                <Ionicons name="book" size={24} color={Colors.primary} />
              </View>
              <View style={styles.sectionText}>
                <Text style={styles.sectionTitle}>Theory Basics</Text>
                <Text style={styles.sectionDescription}>
                  Fundamental music theory concepts and terminology
                </Text>
              </View>
            </View>
            <Ionicons 
              name={activeSection === "basics" ? "chevron-up" : "chevron-down"} 
              size={20} 
              color={Colors.secondary} 
            />
          </Pressable>
          
          {activeSection === "basics" && (
            <View style={styles.sectionContent}>
              <View style={styles.basicsContainer}>
                <View style={styles.basicItem}>
                  <Text style={styles.basicTitle}>Intervals</Text>
                  <Text style={styles.basicDescription}>
                    The distance between two notes. Understanding intervals is crucial for building chords and melodies.
                  </Text>
                </View>
                
                <View style={styles.basicItem}>
                  <Text style={styles.basicTitle}>Scales</Text>
                  <Text style={styles.basicDescription}>
                    A series of notes in ascending or descending order. The major and minor scales are the foundation of Western music.
                  </Text>
                </View>
                
                <View style={styles.basicItem}>
                  <Text style={styles.basicTitle}>Keys</Text>
                  <Text style={styles.basicDescription}>
                    A group of pitches that form the basis of a musical composition. Each key has its own set of sharps or flats.
                  </Text>
                </View>
                
                <View style={styles.basicItem}>
                  <Text style={styles.basicTitle}>Time Signatures</Text>
                  <Text style={styles.basicDescription}>
                    Indicates how many beats are in each measure and which note value constitutes one beat.
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Practice Tips */}
        <View style={styles.section}>
          <Pressable
            style={styles.sectionHeader}
            onPress={() => handleSectionPress("tips")}
          >
            <View style={styles.sectionHeaderContent}>
              <View style={styles.sectionIcon}>
                <Ionicons name="bulb" size={24} color={Colors.primary} />
              </View>
              <View style={styles.sectionText}>
                <Text style={styles.sectionTitle}>Practice Tips</Text>
                <Text style={styles.sectionDescription}>
                  Effective strategies for learning and applying music theory
                </Text>
              </View>
            </View>
            <Ionicons 
              name={activeSection === "tips" ? "chevron-up" : "chevron-down"} 
              size={20} 
              color={Colors.secondary} 
            />
          </Pressable>
          
          {activeSection === "tips" && (
            <View style={styles.sectionContent}>
              <View style={styles.tipsContainer}>
                <View style={styles.tipItem}>
                  <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                  <Text style={styles.tipText}>
                    Start with basic intervals and gradually build to more complex concepts
                  </Text>
                </View>
                
                <View style={styles.tipItem}>
                  <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                  <Text style={styles.tipText}>
                    Practice identifying chords and progressions in your favorite songs
                  </Text>
                </View>
                
                <View style={styles.tipItem}>
                  <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                  <Text style={styles.tipText}>
                    Use the Circle of Fifths to understand key relationships
                  </Text>
                </View>
                
                <View style={styles.tipItem}>
                  <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                  <Text style={styles.tipText}>
                    Experiment with different chord voicings and inversions
                  </Text>
                </View>
                
                <View style={styles.tipItem}>
                  <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                  <Text style={styles.tipText}>
                    Apply theory concepts to your own compositions and improvisations
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>


      </ScrollView>
      
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
          style={[styles.navItem, activeTab === "tonusVivo" && styles.navItemActive]}
          onPress={() => handleTabPress("tonusVivo")}
        >
          <Ionicons 
            name="musical-note" 
            size={24} 
            color={activeTab === "tonusVivo" ? Colors.primary : Colors.secondary} 
          />
          <Text style={[styles.navLabel, activeTab === "tonusVivo" && styles.navLabelActive]}>
            Tonus Vivo
          </Text>
        </Pressable>
        
        <Pressable
          style={[styles.navItem, activeTab === "chords" && styles.navItemActive]}
          onPress={() => handleTabPress("chords")}
        >
          <Ionicons 
            name="compass" 
            size={24} 
            color={activeTab === "chords" ? Colors.primary : Colors.secondary} 
          />
          <Text style={[styles.navLabel, activeTab === "chords" && styles.navLabelActive]}>
            Chords
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
    paddingBottom: 20,
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
  welcomeSection: {
    paddingVertical: 20,
    alignItems: "center",
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  welcomeDescription: {
    fontSize: 14,
    color: Colors.secondary,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 300,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.bgActive,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  sectionHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(58, 58, 58, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sectionText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 12,
    color: Colors.secondary,
  },
  sectionContent: {
    backgroundColor: Colors.bgActive,
    borderRadius: 12,
    marginTop: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  basicsContainer: {
    gap: 16,
  },
  basicItem: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  basicTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 6,
  },
  basicDescription: {
    fontSize: 12,
    color: Colors.secondary,
    lineHeight: 18,
  },
  tipsContainer: {
    gap: 12,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  tipText: {
    fontSize: 12,
    color: Colors.secondary,
    lineHeight: 18,
    flex: 1,
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