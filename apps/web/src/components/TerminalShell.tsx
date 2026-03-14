import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import cvPdf from '../CV/Pedro_Duarte_CV.pdf'
import { profile } from '../content/profile'
import {
  type ContactEmailValues,
  sendContactEmail,
} from '../utils/contactEmail'
import { runCommand } from '../utils/terminalCommands'
import { isTurnstileConfigured } from '../utils/turnstile'
import TurnstileWidget from './TurnstileWidget'

interface TerminalShellProps {
  onClose: () => void
}

type EmailComposerStep = 'name' | 'email' | 'subject' | 'message' | 'confirm'

type EmailComposerState = {
  step: EmailComposerStep
  draft: {
    name: string
    email: string
    subject: string
    messageLines: string[]
  }
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function AsciiArt({
  art,
  id,
  containerRef,
}: {
  art: string
  id: number | string
  containerRef: React.RefObject<HTMLDivElement | null>
}) {
  const artLines = art.split('\n')
  const [visible, setVisible] = useState(0)

  useEffect(() => {
    if (visible >= artLines.length) return
    const t = setTimeout(() => setVisible((v) => v + 1), 28)
    return () => clearTimeout(t)
  }, [visible, artLines.length])

  // biome-ignore lint/correctness/useExhaustiveDependencies: ref is stable and we only care about visible changes
  useEffect(() => {
    try {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight
      }
    } catch {}
  }, [visible])

  return (
    <div key={id} className="py-1">
      <pre className="m-0 whitespace-pre font-mono text-[6.75px] leading-[0.525] text-terminal-green">
        {artLines.slice(0, visible).join('\n')}
      </pre>
    </div>
  )
}

export default function TerminalShell({ onClose }: TerminalShellProps) {
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
  const [chatMode, setChatMode] = useState(false)
  const [chatAwaiting, setChatAwaiting] = useState(false)
  const [emailComposer, setEmailComposer] = useState<EmailComposerState | null>(
    null,
  )
  const [emailSending, setEmailSending] = useState(false)
  const [emailTurnstileToken, setEmailTurnstileToken] = useState<string | null>(
    null,
  )
  const [emailTurnstileResetSignal, setEmailTurnstileResetSignal] = useState(0)
  const turnstileAvailable = isTurnstileConfigured()

  function appendOutput(text: string) {
    setLines((current) => [
      ...current,
      { id: Date.now() + Math.random(), text, type: 'out' },
    ])
  }

  function appendOutputs(texts: string[]) {
    if (texts.length === 0) return
    setLines((current) => [
      ...current,
      ...texts.map((text, index) => ({
        id: Date.now() + index + Math.random(),
        text,
        type: 'out' as const,
      })),
    ])
  }

  const handleClose = useCallback(() => {
    if (chatMode) {
      setChatMode(false)
      setLines((l) => [
        ...l,
        { id: Date.now() + 1, text: 'Exited chat mode.', type: 'out' },
      ])
    }
    onClose()
  }, [chatMode, onClose])

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
            className="text-terminal-accent underline transition-colors hover:text-white"
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
            className="text-terminal-accent underline transition-colors hover:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        )
      }
      return <span key={key}>{part}</span>
    })
  }

  function getEmailDraft(state: EmailComposerState): ContactEmailValues {
    return {
      name: state.draft.name,
      email: state.draft.email,
      subject: state.draft.subject,
      message: state.draft.messageLines.join('\n'),
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => inputRef.current?.focus(), 50)
    setLines((l) =>
      l.length > 0
        ? l
        : [
            {
              id: Date.now(),
              text: 'Welcome. Type "help" for available commands.',
              type: 'out',
            },
          ],
    )

    return () => window.clearTimeout(timeoutId)
  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally only run when lines change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [lines])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [handleClose])

  async function handleSubmit(cmdRaw: string) {
    const cmd = cmdRaw.trim()
    // If prompting for Y/N confirmation, treat single-letter responses specially
    if (pendingConfirm) {
      if (!cmd) return
      const key = cmd.toLowerCase()
      if (key === 'y' || key === 'yes') {
        setLines((l) => [
          ...l,
          { id: Date.now(), text: `> ${cmd}`, type: 'in' },
        ])
        setPendingConfirm(null)
        try {
          pendingConfirm.action()
          appendOutput('Download started in your browser.')
        } catch (e) {
          appendOutput('Failed to start download.')
        }
      } else {
        setLines((l) => [
          ...l,
          { id: Date.now(), text: `> ${cmd}`, type: 'in' },
        ])
        appendOutput('Download cancelled.')
        setPendingConfirm(null)
      }
      setInput('')
      return
    }

    if (emailComposer) {
      const lower = cmd.toLowerCase()
      setLines((current) => [
        ...current,
        { id: Date.now(), text: `> ${cmd}`, type: 'in' },
      ])
      setInput('')

      if (lower === 'cancel') {
        setEmailComposer(null)
        setEmailTurnstileToken(null)
        setEmailTurnstileResetSignal((value) => value + 1)
        appendOutput('Email composition cancelled.')
        return
      }

      if (emailComposer.step === 'name') {
        if (cmd.length < 2) {
          appendOutputs([
            'Please enter a name between 2 and 100 characters.',
            'Your name:',
          ])
          return
        }

        if (cmd.length > 100) {
          appendOutputs([
            'Please enter a name between 2 and 100 characters.',
            'Your name:',
          ])
          return
        }

        setEmailComposer({
          step: 'email',
          draft: {
            ...emailComposer.draft,
            name: cmd,
          },
        })
        appendOutput('Your email:')
        return
      }

      if (emailComposer.step === 'email') {
        if (!isValidEmail(cmd)) {
          appendOutputs(['Please enter a valid email address.', 'Your email:'])
          return
        }

        setEmailComposer({
          step: 'subject',
          draft: {
            ...emailComposer.draft,
            email: cmd,
          },
        })
        appendOutput('Subject:')
        return
      }

      if (emailComposer.step === 'subject') {
        if (cmd.length < 3 || cmd.length > 160) {
          appendOutputs([
            'Please enter a subject between 3 and 160 characters.',
            'Subject:',
          ])
          return
        }

        setEmailComposer({
          step: 'message',
          draft: {
            ...emailComposer.draft,
            subject: cmd,
          },
        })
        appendOutput(
          'Message: type your message. Press Enter on an empty line when finished.',
        )
        return
      }

      if (emailComposer.step === 'message') {
        if (!cmd) {
          const currentMessage = emailComposer.draft.messageLines
            .join('\n')
            .trim()
          if (currentMessage.length < 10) {
            appendOutput(
              'Please enter a message between 10 and 4000 characters.',
            )
            return
          }

          const nextState: EmailComposerState = {
            step: 'confirm',
            draft: emailComposer.draft,
          }
          const draft = getEmailDraft(nextState)
          setEmailComposer(nextState)
          appendOutputs([
            `Ready to send to ${profile.email}:`,
            `From: ${draft.name} <${draft.email}>`,
            `Subject: ${draft.subject}`,
            '',
            draft.message,
            '',
            'Send now? (y/n)',
          ])
          return
        }

        const nextMessage = [...emailComposer.draft.messageLines, cmdRaw].join(
          '\n',
        )
        if (nextMessage.length > 4000) {
          appendOutput('Please keep the message under 4000 characters.')
          return
        }

        setEmailComposer({
          step: 'message',
          draft: {
            ...emailComposer.draft,
            messageLines: [...emailComposer.draft.messageLines, cmdRaw],
          },
        })
        return
      }

      if (emailComposer.step === 'confirm') {
        if (
          lower !== 'y' &&
          lower !== 'yes' &&
          lower !== 'n' &&
          lower !== 'no'
        ) {
          appendOutput('Please answer y or n.')
          return
        }

        if (lower === 'n' || lower === 'no') {
          setEmailComposer(null)
          setEmailTurnstileToken(null)
          setEmailTurnstileResetSignal((value) => value + 1)
          appendOutput('Email sending cancelled.')
          return
        }

        if (!turnstileAvailable) {
          appendOutput(
            'Spam verification is not configured right now. Please use the direct email link instead.',
          )
          return
        }

        if (!emailTurnstileToken) {
          appendOutput('Complete the spam check before sending your message.')
          return
        }

        setEmailSending(true)
        try {
          await sendContactEmail(
            getEmailDraft(emailComposer),
            'terminal',
            emailTurnstileToken,
          )
          setEmailComposer(null)
          setEmailTurnstileToken(null)
          appendOutput('Email sent successfully.')
        } catch (error) {
          appendOutputs([
            error instanceof Error && error.message
              ? error.message
              : 'Unable to send your message right now.',
            'Type y to try again or n to cancel.',
          ])
        } finally {
          setEmailTurnstileResetSignal((value) => value + 1)
          setEmailSending(false)
        }
        return
      }
    }

    if (!cmd) return
    const parts = cmd.split(/\s+/).filter(Boolean)
    setLines((l) => [...l, { id: Date.now(), text: `> ${cmd}`, type: 'in' }])
    setHistory((h) => [...h, cmd])
    setHistIdx(null)
    setInput('')

    if (cmd === 'clear') {
      setLines([])
      return
    }

    if (cmd === 'email' && parts.length === 1) {
      setEmailTurnstileToken(null)
      setEmailTurnstileResetSignal((value) => value + 1)
      setEmailComposer({
        step: 'name',
        draft: {
          name: '',
          email: '',
          subject: '',
          messageLines: [],
        },
      })
      appendOutputs([
        'Email mode — type `cancel` at any prompt to stop.',
        `This message will be sent to ${profile.email}.`,
        'Complete the verification block below before sending.',
        'Your name:',
      ])
      return
    }

    // Enter interactive chat mode
    if (cmd === 'chat' && parts.length === 1) {
      setChatMode(true)
      setLines((l) => [
        ...l,
        {
          id: Date.now() + 1,
          text: 'Chat mode — type your message. Type `exit` to leave.',
          type: 'out',
        },
      ])
      setInput('')
      return
    }

    // If in chatMode, treat input as chat messages until exit
    if (chatMode) {
      if (cmd === 'exit') {
        setChatMode(false)
        setLines((l) => [
          ...l,
          { id: Date.now() + 1, text: 'Exited chat mode.', type: 'out' },
        ])
        setInput('')
        return
      }

      setChatAwaiting(true)
      // send to chat endpoint via runCommand
      const chatOut = await runCommand(`chat ${cmd}`, { profile })
      for (const ln of chatOut) {
        setLines((l) => [
          ...l,
          { id: Date.now() + Math.random(), text: ln, type: 'out' },
        ])
        // small delay to simulate streaming
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 120))
      }
      setChatAwaiting(false)
      setInput('')
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
    if (emailSending) return

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

  return (
    <section
      aria-label="Terminal shell"
      className="flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-terminal-bg"
    >
      <div className="flex items-center justify-between border-b border-gray-800 px-4 py-2">
        <div className="font-mono text-sm text-terminal-green">
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
            onClick={handleClose}
            className="text-xs text-gray-400 hover:text-white"
          >
            close
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="custom-scrollbar min-h-0 flex-1 overflow-auto overflow-x-hidden overscroll-contain p-4 pr-[5px] font-mono text-sm text-terminal-green"
      >
        {lines.length === 0 ? (
          <div className="text-terminal-green">
            {profile.name} — {profile.role}
          </div>
        ) : (
          lines.map((ln) => {
            // special rendering for ASCII art blocks emitted by runCommand
            const asciiPrefix = '::ASCII_ART::\n'
            if (
              typeof ln.text === 'string' &&
              ln.text.startsWith(asciiPrefix)
            ) {
              const art = ln.text.slice(asciiPrefix.length)
              return (
                <AsciiArt art={art} id={ln.id} containerRef={containerRef} />
              )
            }

            return (
              <div
                key={ln.id}
                className={`${ln.type === 'in' ? 'text-white' : 'text-green-200'} whitespace-pre-wrap py-0.5`}
              >
                {renderLineText(ln.text, ln.id)}
              </div>
            )
          })
        )}
        {chatAwaiting && (
          <div className="text-yellow-300 whitespace-pre-wrap py-0.5 font-mono">
            AI is thinking
            <span className="inline-block ml-1 animate-pulse">...</span>
          </div>
        )}
      </div>

      <div className="border-t border-gray-800 bg-[#060d18] px-4 py-3">
        {emailComposer && (
          <div className="mb-3 rounded-xl border border-[#173225] bg-[#081221] px-3 py-3 shadow-[inset_0_1px_0_rgba(126,231,135,0.05)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-green-300/70">
                  Message Verification
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  {emailTurnstileToken
                    ? 'Verification is complete. Answer y to send when you are ready.'
                    : 'Complete the spam check to unlock sending from the terminal.'}
                </p>
              </div>
              <div className="self-start rounded-full border border-[#1b3a31] bg-black/30 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-terminal-accent">
                email mode
              </div>
            </div>

            {turnstileAvailable ? (
              <TurnstileWidget
                action="terminal_email"
                onTokenChange={setEmailTurnstileToken}
                resetSignal={emailTurnstileResetSignal}
                className="mt-3"
                variant="terminal"
              />
            ) : (
              <div
                className="mt-3 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
                role="alert"
              >
                Spam verification is not configured right now. Please use the
                direct email link instead.
              </div>
            )}
          </div>
        )}
        <div className="flex items-center gap-3">
          <div className="font-mono text-terminal-green">$</div>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={emailSending}
            className="w-full bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none font-mono"
            placeholder={
              emailComposer
                ? emailComposer.step === 'message'
                  ? 'type message lines; empty line finishes'
                  : emailComposer.step === 'confirm'
                    ? 'type y or n'
                    : 'answer the prompt'
                : 'type a command (help)'
            }
          />
        </div>
      </div>
    </section>
  )
}
