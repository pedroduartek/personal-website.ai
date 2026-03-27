import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function TerminalPage() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/', {
      replace: true,
      state: {
        openTerminalWindow: true,
      },
    })
  }, [navigate])

  return null
}
