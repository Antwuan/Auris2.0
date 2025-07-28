import { en, es, Translation } from "./translations"
import { useCallback } from "react"
import { useConfigStore } from "./stores/configStore"

/**
 * React hook that provides the proper translation function
 * according to the device's preferences or app settings.
 * @returns a function to use as t('key'), where 'key' keyof Translation.
 */
export const useTranslation = () => {
  const t = useCallback(
    (key: keyof Translation) => {
          return en[key]
    },
    []
  )
  return t
}


