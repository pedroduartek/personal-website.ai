import { useEffect, useState } from 'react'
import { CHAT_API_HEALTH_URL, checkApiHealth } from '../utils/apiClient'

let cachedChatAvailability: boolean | null = null
let availabilityRequest: Promise<boolean> | null = null

const listeners = new Set<(value: boolean) => void>()

function notifyListeners(value: boolean) {
  for (const listener of listeners) {
    listener(value)
  }
}

function setCachedChatAvailability(value: boolean) {
  cachedChatAvailability = value
  notifyListeners(value)
}

function ensureChatAvailability() {
  if (cachedChatAvailability !== null) {
    return Promise.resolve(cachedChatAvailability)
  }

  if (availabilityRequest) {
    return availabilityRequest
  }

  availabilityRequest = checkApiHealth(CHAT_API_HEALTH_URL)
    .then((healthy) => {
      setCachedChatAvailability(healthy)
      return healthy
    })
    .catch(() => {
      setCachedChatAvailability(false)
      return false
    })
    .finally(() => {
      availabilityRequest = null
    })

  return availabilityRequest
}

export function resetChatAvailabilityCache() {
  cachedChatAvailability = null
  availabilityRequest = null
}

export function useChatAvailability() {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(
    cachedChatAvailability,
  )

  useEffect(() => {
    const handleAvailability = (value: boolean) => {
      setIsAvailable(value)
    }

    listeners.add(handleAvailability)

    if (cachedChatAvailability !== null) {
      setIsAvailable(cachedChatAvailability)
    } else {
      void ensureChatAvailability().then((value) => {
        setIsAvailable(value)
      })
    }

    return () => {
      listeners.delete(handleAvailability)
    }
  }, [])

  return isAvailable
}
