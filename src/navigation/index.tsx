import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Home } from "./screens/Home"
import { Tuneo } from "./screens/Tuneo"
import { MusicTheory } from "./screens/MusicTheory"
import { ChordCompass } from "./screens/ChordCompass"
import { CircleOfFifths } from "./screens/CircleOfFifths"

import IntervalTraining from "./screens/IntervalTraining"
import NoteRecognition from "./screens/NoteRecognition"
import { Lessons } from "./screens/Lessons"

export type RootStackParamList = {
  Home: undefined
  Tuneo: undefined
  MusicTheory: undefined
  ChordCompass: undefined
  CircleOfFifths: undefined
  ChordProgressions: undefined
  IntervalTraining: undefined
  NoteRecognition: undefined
  Lessons: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export const RootStack = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Tuneo" component={Tuneo} />
          <Stack.Screen name="MusicTheory" component={MusicTheory} />
          <Stack.Screen name="ChordCompass" component={ChordCompass} />
          <Stack.Screen name="CircleOfFifths" component={CircleOfFifths} />
  
          <Stack.Screen name="IntervalTraining" component={IntervalTraining} />
          <Stack.Screen name="NoteRecognition" component={NoteRecognition} />
          <Stack.Screen name="Lessons" component={Lessons} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}
