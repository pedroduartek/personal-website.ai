import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import TerminalShell from '../../components/TerminalShell'
import PageSEO from '../../components/seo/PageSEO'

type TerminalLocationState = {
  from?: string
}

export default function TerminalPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as TerminalLocationState | null

  const handleClose = useCallback(() => {
    const from = state?.from
    if (from && from !== '/terminal') {
      navigate(from)
      return
    }

    navigate('/')
  }, [navigate, state])

  return (
    <>
      <PageSEO
        title="Terminal"
        description="Terminal-style shell for navigating the website"
        image="/src/images/pld_logo_header.png"
        url={
          typeof window !== 'undefined'
            ? window.location.href
            : 'https://www.pedroduartek.com/terminal'
        }
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <TerminalShell onClose={handleClose} />
      </div>
    </>
  )
}
