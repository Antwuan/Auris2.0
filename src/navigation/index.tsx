import { createStaticNavigation } from "@react-navigation/native"
import type { StaticParamList } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Home } from "./screens/Home"
import { Tuneo } from "./screens/Tuneo"
import { Lessons } from "./screens/Lessons"
import NoteRecognitionScreen from "./screens/NoteRecognition"
import IntervalTrainingScreen from "./screens/IntervalTraining"

const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: Home,
      options: {
        headerShown: false,
      },
    },
    Tuneo: {
      screen: Tuneo,
      options: {
        headerShown: false,
      },
    },
    Lessons: {
      screen: Lessons,
      options: {
        headerShown: false,
      },
    },
    NoteRecognition: {
      screen: NoteRecognitionScreen,
      options: {
        headerShown: false,
      },
    },
    IntervalTraining: {
      screen: IntervalTrainingScreen,
      options: {
        headerShown: false,
      },
    },
  },
})

export const Navigation = createStaticNavigation(RootStack)

type RootStackParamList = StaticParamList<typeof RootStack>

declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
