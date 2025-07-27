import { createStaticNavigation } from "@react-navigation/native"
import type { StaticParamList } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Tuneo } from "./screens/Tuneo"

const RootStack = createNativeStackNavigator({
  screens: {
    Tuneo: {
      screen: Tuneo,
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
