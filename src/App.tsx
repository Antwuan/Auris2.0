import * as SplashScreen from "expo-splash-screen"
import * as React from "react"
import { RootStack } from "./navigation"

SplashScreen.preventAutoHideAsync()

export function App() {
  React.useEffect(() => {
    SplashScreen.hideAsync()
  }, [])

  return <RootStack />
}
