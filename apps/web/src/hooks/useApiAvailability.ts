import { useEffect, useState } from 'react'
import { CHAT_API_HEALTH_URL, checkApiHealth } from '../utils/apiClient'

let cachedApiAvailability: boolean | null = null
let availabilityRequest: Promise<boolean> | null = null

const listeners = new Set<(value: boolean) => void>()
const LOCAL_API_PREVIEW_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  '::1',
  '[::1]',
])

type LocalApiPreviewOptions = {
  hostname?: string
  isDev?: boolean
  mode?: string
  showLocallyFlag?: string | undefined
}

function notifyListeners(value: boolean) {
  for (const listener of listeners) {
    listener(value)
  }
}

function setCachedApiAvailability(value: boolean) {
  cachedApiAvailability = value
  notifyListeners(value)
}

export function shouldPreviewApiFeaturesLocally({
  hostname = typeof window !== 'undefined' ? window.location.hostname : '',
  isDev = import.meta.env.DEV,
  mode = import.meta.env.MODE,
  showLocallyFlag = import.meta.env.VITE_SHOW_API_FEATURES_LOCALLY,
}: LocalApiPreviewOptions = {}) {
  if (mode === 'test') return false

  const normalizedHostname = hostname.trim().toLowerCase()
  const isLocalHost = LOCAL_API_PREVIEW_HOSTS.has(normalizedHostname)
  if (!isLocalHost) return false

  if (showLocallyFlag === 'false') return false
  if (showLocallyFlag === 'true') return true

  return isDev
}

function getForcedLocalApiAvailability() {
  return shouldPreviewApiFeaturesLocally() ? true : null
}

export function ensureApiAvailability() {
  const forcedAvailability = getForcedLocalApiAvailability()
  if (forcedAvailability !== null) {
    if (cachedApiAvailability !== forcedAvailability) {
      setCachedApiAvailability(forcedAvailability)
    }
    return Promise.resolve(forcedAvailability)
  }

  if (cachedApiAvailability !== null) {
    return Promise.resolve(cachedApiAvailability)
  }

  if (availabilityRequest) {
    return availabilityRequest
  }

  availabilityRequest = checkApiHealth(CHAT_API_HEALTH_URL)
    .then((healthy) => {
      setCachedApiAvailability(healthy)
      return healthy
    })
    .catch(() => {
      setCachedApiAvailability(false)
      return false
    })
    .finally(() => {
      availabilityRequest = null
    })

  return availabilityRequest
}

export function resetApiAvailabilityCache() {
  cachedApiAvailability = null
  availabilityRequest = null
}

export function useApiAvailability() {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(() => {
    const forcedAvailability = getForcedLocalApiAvailability()
    return forcedAvailability ?? cachedApiAvailability
  })

  useEffect(() => {
    const handleAvailability = (value: boolean) => {
      setIsAvailable(value)
    }

    listeners.add(handleAvailability)

    const forcedAvailability = getForcedLocalApiAvailability()
    if (forcedAvailability !== null) {
      if (cachedApiAvailability !== forcedAvailability) {
        setCachedApiAvailability(forcedAvailability)
      }
      setIsAvailable(forcedAvailability)
    } else if (cachedApiAvailability !== null) {
      setIsAvailable(cachedApiAvailability)
    } else {
      void ensureApiAvailability().then((value) => {
        setIsAvailable(value)
      })
    }

    return () => {
      listeners.delete(handleAvailability)
    }
  }, [])

  return isAvailable
}
