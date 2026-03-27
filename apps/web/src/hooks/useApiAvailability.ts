import { useEffect, useState } from 'react'
import { CHAT_API_HEALTH_URL, checkApiHealth } from '../utils/apiClient'

let cachedApiAvailability: boolean | null = null
let availabilityRequest: Promise<boolean> | null = null

const listeners = new Set<(value: boolean) => void>()

function notifyListeners(value: boolean) {
  for (const listener of listeners) {
    listener(value)
  }
}

function setCachedApiAvailability(value: boolean) {
  cachedApiAvailability = value
  notifyListeners(value)
}

export function ensureApiAvailability() {
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
  const [isAvailable, setIsAvailable] = useState<boolean | null>(
    cachedApiAvailability,
  )

  useEffect(() => {
    const handleAvailability = (value: boolean) => {
      setIsAvailable(value)
    }

    listeners.add(handleAvailability)

    if (cachedApiAvailability !== null) {
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
