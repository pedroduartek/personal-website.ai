import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import cvPdf from '../CV/Pedro_Duarte_CV.pdf'
import { profile } from '../content/profile'
import { runCommand } from '../utils/terminalCommands'

interface TerminalShellProps {
  isOpen: boolean
  onClose: () => void
}

export default function TerminalShell({ isOpen, onClose }: TerminalShellProps) {
  const [lines, setLines] = useState<
    Array<{ id: number; text: string; type: 'out' | 'in' }>
  >([])
  const [pendingConfirm, setPendingConfirm] = useState<null | {
    id: string
    message: string
    action: () => void
  }>(null)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [, setHistIdx] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  function renderLineText(text: string, id: number | string) {
    const urlRegex = /(https?:\/\/[^\s]+)/
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/
    const combined = new RegExp(`${urlRegex.source}|${emailRegex.source}`)
    const parts = text.split(combined)
    return parts.map((part, i) => {
      const key = `${id}-${i}`
      if (urlRegex.test(part)) {
        return (
          <a
            key={key}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 underline hover:text-blue-100"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        )
      }
      if (emailRegex.test(part)) {
        return (
          <a
            key={key}
            href={`mailto:${part}`}
            className="text-blue-300 underline hover:text-blue-100"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        )
      }
      return <span key={key}>{part}</span>
    })
  }

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setLines((l) => [
        ...l,
        {
          id: Date.now(),
          text: `Welcome. Type \"help\" for available commands.`,
          type: 'out',
        },
      ])
    }
  }, [isOpen])

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally only run when lines change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [lines])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', onKey)
    }
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  async function handleSubmit(cmdRaw: string) {
    const cmd = cmdRaw.trim()
    if (!cmd) return
    // If prompting for Y/N confirmation, treat single-letter responses specially
    if (pendingConfirm) {
      const key = cmd.toLowerCase()
      if (key === 'y' || key === 'yes') {
        setLines((l) => [
          ...l,
          { id: Date.now(), text: `> ${cmd}`, type: 'in' },
        ])
        setPendingConfirm(null)
        try {
          pendingConfirm.action()
          setLines((l) => [
            ...l,
            {
              id: Date.now() + 1,
              text: 'Download started in your browser.',
              type: 'out',
            },
          ])
        } catch (e) {
          setLines((l) => [
            ...l,
            {
              id: Date.now() + 1,
              text: 'Failed to start download.',
              type: 'out',
            },
          ])
        }
      } else {
        setLines((l) => [
          ...l,
          { id: Date.now(), text: `> ${cmd}`, type: 'in' },
        ])
        setLines((l) => [
          ...l,
          { id: Date.now() + 1, text: 'Download cancelled.', type: 'out' },
        ])
        setPendingConfirm(null)
      }
      setInput('')
      return
    }
    setLines((l) => [...l, { id: Date.now(), text: `> ${cmd}`, type: 'in' }])
    setHistory((h) => [...h, cmd])
    setHistIdx(null)
    setInput('')

    if (cmd === 'clear') {
      setLines([])
      return
    }

    // Interactive download-cv flow: prompt for confirmation with file size
    if (cmd === 'download-cv') {
      let sizeText = 'unknown size'
      try {
        const res = await fetch(cvPdf, { method: 'HEAD' })
        const cl = res.headers.get('content-length')
        if (cl) {
          const bytes = Number(cl)
          const mb = Math.max(
            0,
            Math.round((bytes / (1024 * 1024)) * 100) / 100,
          )
          sizeText = `${mb} MB`
        }
      } catch (err) {
        // Log errors to console and show in terminal output
        try {
          // eslint-disable-next-line no-console
          console.error('Error fetching CV HEAD:', err)
        } catch {}
        setLines((l) => [
          ...l,
          {
            id: Date.now() + 1,
            text: `Error checking CV size: ${String(err)}`,
            type: 'out',
          },
        ])
      }

      const message = `The CV file is ${sizeText}. Download? (y/n)`
      setLines((l) => [
        ...l,
        { id: Date.now() + 1, text: message, type: 'out' },
      ])
      setPendingConfirm({
        id: String(Date.now()),
        message,
        action: () => {
          const a = document.createElement('a')
          a.href = cvPdf
          a.download = `${profile.name.replace(/\s+/g, '_')}_CV.pdf`
          document.body.appendChild(a)
          a.click()
          a.remove()
        },
      })
      setInput('')
      return
    }

    const out = await runCommand(cmd, { profile })
    for (const ln of out) {
      setLines((l) => [
        ...l,
        { id: Date.now() + Math.random(), text: ln, type: 'out' },
      ])
      await new Promise((r) => setTimeout(r, 80))
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      void handleSubmit(input)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHistIdx((prev) => {
        const next = prev === null ? history.length - 1 : Math.max(0, prev - 1)
        if (next >= 0) setInput(history[next])
        return next
      })
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHistIdx((prev) => {
        if (prev === null) return null
        const next = Math.min(history.length - 1, prev + 1)
        setInput(history[next] ?? '')
        return next === history.length - 1 ? null : next
      })
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
      e.preventDefault()
      setLines([])
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-60">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close terminal overlay"
      />
      <div className="mx-auto my-12 w-[min(1000px,95%)] max-h-[80vh] overflow-hidden rounded-md border border-gray-700 bg-[#071021] shadow-2xl relative z-10">
        <div className="flex items-center justify-between border-b border-gray-800 px-4 py-2">
          <div className="text-sm text-green-300 font-mono">
            terminal — pedroduartek
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLines([])}
              className="text-xs text-gray-400 hover:text-white"
            >
              clear
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-gray-400 hover:text-white"
            >
              close
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="h-[60vh] overflow-auto p-4 font-mono text-sm text-green-200"
        >
          {lines.length === 0 ? (
            <div className="text-green-300">
              {profile.name} — {profile.role}
            </div>
          ) : (
            lines.map((ln) => (
              <div
                key={ln.id}
                className={`${ln.type === 'in' ? 'text-white' : 'text-green-200'} whitespace-pre-wrap py-0.5`}
              >
                {renderLineText(ln.text, ln.id)}
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gray-800 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="text-green-400 font-mono">$</div>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none font-mono"
              placeholder="type a command (help)"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
