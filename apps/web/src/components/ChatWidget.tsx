import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

// small keyframes for typing dots animation (inlined style fallback)
const typingKeyframes =
  '@keyframes typing { 0% { transform: translateY(0); opacity: 0.3 } 50% { transform: translateY(-4px); opacity: 1 } 100% { transform: translateY(0); opacity: 0.3 } }'

// custom scrollbar styles to match the UI (dark background, indigo accent)
const scrollbarStyles = `
.custom-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(99,102,241,0.38) transparent; }
.custom-scrollbar::-webkit-scrollbar { width: 10px; height: 10px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; border-radius: 9999px; margin: 6px 0; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(99,102,241,0.28); border-radius: 9999px; border: 2px solid transparent; transition: background-color .18s ease; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(99,102,241,0.52); }
`

type Message = { id: number; text: string; from: 'user' | 'bot' }

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const containerRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [awaitingReply, setAwaitingReply] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [placeholderWords, setPlaceholderWords] = useState(0)
  const placeholderIntervalRef = useRef<number | null>(null)
  const placeholderWidths = [40, 65, 35, 50, 60, 30, 45, 55, 38, 48, 62, 34]
  const abortControllerRef = useRef<AbortController | null>(null)
  const [showNote, setShowNote] = useState(true)

  const internalStaticRoutes = new Set([
    '/',
    '/about',
    '/experience',
    '/projects',
    '/projects/personal-website',
    '/projects/home-assistant',
    '/projects/ai-chat-api',
    '/education',
    '/conferences',
    '/skills',
    '/contact',
    '/cv',
  ])

  function isInternalRoute(pathname: string) {
    if (!pathname.startsWith('/')) return false
    if (internalStaticRoutes.has(pathname)) return true
    if (pathname.startsWith('/experience/'))
      return pathname.length > '/experience/'.length
    if (pathname.startsWith('/projects/'))
      return pathname.length > '/projects/'.length
    return false
  }

  function validateReply(text: string): boolean {
    const urlRegex = /(https?:\/\/[^\s]+)|\/[^\s]+/g
    const matches = Array.from(text.matchAll(urlRegex)).map((m) => m[0])
    if (matches.length === 0) return true
    for (const matched of matches) {
      let pathname = ''
      if (matched.startsWith('/')) {
        pathname = matched.split(/[?#]/)[0]
      } else {
        try {
          pathname = new URL(matched).pathname
        } catch {
          pathname = ''
        }
      }
      if (pathname && isInternalRoute(pathname)) return true
    }
    return false
  }

  async function send() {
    if (awaitingReply) return
    if (!input.trim()) return
    const text = input.trim()
    const msg: Message = { id: Date.now(), text, from: 'user' }
    setMessages((s) => [...s, msg])
    setInput('')
    setAwaitingReply(true)
    setStreamingText('')

    const controller = new AbortController()
    abortControllerRef.current = controller

    const apiUrl = import.meta.env.DEV
      ? '/api/chat/stream'
      : 'https://api.pedroduartek.com/chat/stream'

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
        signal: controller.signal,
      })

      if (res.status !== 200 || !res.body) {
        setMessages((s) => [
          ...s,
          {
            id: Date.now() + 1,
            text: 'Sorry — the chat service is unavailable right now. Please try again later.',
            from: 'bot',
          },
        ])
        setAwaitingReply(false)
        setStreamingText('')
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        // keep the last (possibly incomplete) line in the buffer
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const payload = line.slice(6)
            if (payload === '[DONE]') continue
            accumulated += payload
            setStreamingText(accumulated)
          }
        }
      }

      // process any remaining buffer
      if (buffer.startsWith('data: ')) {
        const payload = buffer.slice(6)
        if (payload !== '[DONE]') {
          accumulated += payload
        }
      }

      const finalText = accumulated || 'Sorry — I couldn\'t generate a response.'

      if (!validateReply(finalText)) {
        setMessages((s) => [
          ...s,
          {
            id: Date.now() + 1,
            text: 'Unable to find a response to your question',
            from: 'bot',
          },
        ])
      } else {
        setMessages((s) => [
          ...s,
          { id: Date.now() + 1, text: finalText, from: 'bot' },
        ])
      }
      setAwaitingReply(false)
      setStreamingText('')
    } catch (err: unknown) {
      if (controller.signal.aborted) {
        setAwaitingReply(false)
        setStreamingText('')
        return
      }
      try {
        console.error('ChatWidget error:', err)
      } catch {
        // ignore logging failures
      }
      setMessages((s) => [
        ...s,
        {
          id: Date.now() + 1,
          text: 'Sorry — the chat service is unavailable right now. Please try again later.',
          from: 'bot',
        },
      ])
      setAwaitingReply(false)
      setStreamingText('')
    }
  }

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const el = containerRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior })
  }, [])

  // Focus input when opening
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // Always follow latest message (including when streaming or placeholder is shown)
  useEffect(() => {
    // when awaitingReply is true and no streaming text yet, let the placeholder effect control scrolling
    if (awaitingReply && !streamingText) return
    scrollToBottom('smooth')
  }, [awaitingReply, streamingText, scrollToBottom])

  // Show skeleton placeholder while awaiting first token
  useEffect(() => {
    const maxWords = 12
    const showSkeleton = awaitingReply && !streamingText
    if (showSkeleton) {
      setPlaceholderWords(0)
      placeholderIntervalRef.current = window.setInterval(() => {
        setPlaceholderWords((n) => Math.min(maxWords, n + 1))
      }, 300)
    } else {
      if (placeholderIntervalRef.current) {
        clearInterval(placeholderIntervalRef.current)
        placeholderIntervalRef.current = null
      }
      setPlaceholderWords(0)
    }
    return () => {
      if (placeholderIntervalRef.current) {
        clearInterval(placeholderIntervalRef.current)
        placeholderIntervalRef.current = null
      }
    }
  }, [awaitingReply, streamingText])

  // Scroll the last placeholder word into view so the bottom aligns with the container
  useEffect(() => {
    if (!awaitingReply || streamingText) return
    const el = containerRef.current
    if (!el) return
    const lastIndex = Math.min(placeholderWords, placeholderWidths.length) - 1
    if (lastIndex < 0) return
    const selector = `[data-placeholder-last="${lastIndex}"]`
    const node = el.querySelector(selector) as HTMLElement | null
    if (node) {
      const nodeBottom = node.offsetTop + node.offsetHeight
      const desiredTop = nodeBottom - el.clientHeight + 10
      const top = Math.max(0, desiredTop)
      el.scrollTo({ top, behavior: 'smooth' })
    }
  }, [placeholderWords, awaitingReply, streamingText])

  return (
    <>
      <style>{typingKeyframes + scrollbarStyles}</style>
      {/* Floating Button */}
      <button
        type="button"
        aria-label={open ? 'Close chat' : 'Open chat'}
        onClick={() => setOpen((v) => !v)}
        className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 p-2 text-white shadow-lg hover:bg-indigo-500 focus:outline-none"
      >
        {open ? (
          // X icon
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            role="img"
          >
            <title>Close chat</title>
            <path
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          // Robot face icon
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
          >
            <title>Chat bot</title>
            <rect x="3" y="7" width="18" height="11" rx="2" strokeWidth={2} />
            <rect x="8" y="3" width="8" height="4" rx="1" strokeWidth={2} />
            <circle cx="9" cy="12" r="1.25" fill="currentColor" />
            <circle cx="15" cy="12" r="1.25" fill="currentColor" />
            <path
              d="M8 16c1 1 3 1 4 1s3 0 4-1"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Chat Drawer */}
      {open && (
        <div className="fixed right-6 bottom-20 z-50 w-80 max-w-full transform-gpu rounded-lg bg-gray-900 shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-800 px-3 py-2">
            <div className="text-sm font-medium text-white">Chat</div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded p-1 text-gray-300 hover:text-white"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>
          {showNote && (
            <div className="relative px-3 pr-10 py-2 text-xs text-yellow-100 bg-yellow-700/10 border-t border-yellow-700/20">
              <strong className="font-medium">Note: </strong>
              This chat AI is a primitive proof-of-concept (POC). It is limited
              and may be incorrect — do not trust it for important or sensitive
              decisions. It was told to only reply using the content of this
              website.
              <button
                type="button"
                aria-label="Dismiss note"
                onClick={() => setShowNote(false)}
                className="absolute right-2 top-2 rounded p-1 text-yellow-200 hover:text-white"
              >
                ✕
              </button>
            </div>
          )}
          <div className="relative flex h-72 flex-col gap-2 overflow-hidden p-3">
            <div
              ref={containerRef}
              className="flex-1 overflow-auto overflow-x-hidden custom-scrollbar pr-[5px]"
            >
              <div className="flex flex-col gap-2">
                {messages.length === 0 && (
                  <div className="text-sm text-gray-400">
                    Hey!👋
                    <br />
                    <br />
                    Ask me any questions about Pedro Duarte, if I can find that
                    information in this website I'll tell you.
                  </div>
                )}
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[85%] rounded-lg p-2 text-sm break-words whitespace-pre-wrap ${
                      m.from === 'user'
                        ? 'ml-auto bg-indigo-700 text-white'
                        : 'bg-gray-800 text-gray-200'
                    }`}
                  >
                    {m.from === 'bot'
                      ? (() => {
                          const text: string = m.text

                          // Helper: parse inline URLs in a text segment
                          const parseUrls = (segment: string, keyPrefix: string): React.ReactNode[] => {
                            const urlRegex = /(https?:\/\/[^\s]+)|\/[^\s]+/g
                            const nodes: React.ReactNode[] = []
                            let last = 0
                            while (true) {
                              const match = urlRegex.exec(segment)
                              if (!match) break
                              const idx = match.index
                              if (idx > last) {
                                nodes.push(
                                  <span key={`${keyPrefix}-${nodes.length}`}>
                                    {segment.slice(last, idx)}
                                  </span>,
                                )
                              }
                              const matched = match[0]
                              let pathname = ''
                              if (matched.startsWith('/')) {
                                pathname = matched.split(/[?#]/)[0]
                              } else {
                                try {
                                  const u = new URL(matched)
                                  pathname = u.pathname
                                } catch {
                                  pathname = ''
                                }
                              }
                              if (pathname && isInternalRoute(pathname)) {
                                nodes.push(
                                  <Link
                                    key={`${keyPrefix}-${nodes.length}`}
                                    to={pathname}
                                    className="text-indigo-300 underline"
                                    onClick={() => setOpen(false)}
                                  >
                                    {matched}
                                  </Link>,
                                )
                              } else {
                                nodes.push(
                                  <a
                                    key={`${keyPrefix}-${nodes.length}`}
                                    href={matched}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-300 underline"
                                  >
                                    {matched}
                                  </a>,
                                )
                              }
                              last = idx + matched.length
                            }
                            if (last < segment.length) {
                              nodes.push(
                                <span key={`${keyPrefix}-${nodes.length}`}>
                                  {segment.slice(last)}
                                </span>,
                              )
                            }
                            return nodes
                          }

                          // Split into lines and detect bullet items
                          const lines = text.split('\n')
                          const bulletLines: { isBullet: boolean; content: string }[] = lines.map((line) => {
                            const bulletMatch = line.match(/^\s*\*\s+(.*)/)
                            if (bulletMatch) {
                              return { isBullet: true, content: bulletMatch[1] }
                            }
                            return { isBullet: false, content: line }
                          })

                          // Group consecutive bullet lines together
                          const groups: { type: 'text' | 'bullets'; lines: string[] }[] = []
                          for (const bl of bulletLines) {
                            if (bl.isBullet) {
                              if (groups.length > 0 && groups[groups.length - 1].type === 'bullets') {
                                groups[groups.length - 1].lines.push(bl.content)
                              } else {
                                groups.push({ type: 'bullets', lines: [bl.content] })
                              }
                            } else {
                              if (groups.length > 0 && groups[groups.length - 1].type === 'text') {
                                groups[groups.length - 1].lines.push(bl.content)
                              } else {
                                groups.push({ type: 'text', lines: [bl.content] })
                              }
                            }
                          }

                          return groups.map((group, gi) => {
                            if (group.type === 'bullets') {
                              return (
                                <ul key={`${m.id}-g${gi}`} className="list-disc list-inside space-y-1 my-1">
                                  {group.lines.map((line, li) => (
                                    <li key={`${m.id}-g${gi}-li${li}`}>
                                      {parseUrls(line, `${m.id}-g${gi}-li${li}`)}
                                    </li>
                                  ))}
                                </ul>
                              )
                            }
                            // Regular text block
                            const joined = group.lines.join('\n')
                            return (
                              <span key={`${m.id}-g${gi}`}>
                                {parseUrls(joined, `${m.id}-g${gi}`)}
                              </span>
                            )
                          })
                        })()
                      : m.text}
                  </div>
                ))}
                {awaitingReply && !streamingText && (
                  <output
                    aria-live="polite"
                    className="max-w-[80%] rounded-lg p-2 text-sm bg-gray-800 text-gray-400"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      {(() => {
                        const lastIndex =
                          Math.min(placeholderWords, placeholderWidths.length) -
                          1
                        return placeholderWidths.map((w, i) => {
                          const key = `ph-${i}`
                          const style: React.CSSProperties = { width: `${w}%` }
                          if (i <= placeholderWords) {
                            return (
                              <span
                                key={key}
                                data-placeholder-last={
                                  i === lastIndex ? String(i) : undefined
                                }
                                className="inline-block h-3 rounded bg-gray-600 animate-pulse"
                                style={style}
                              />
                            )
                          }
                          return null
                        })
                      })()}
                    </div>
                  </output>
                )}
                {awaitingReply && streamingText && (
                  <div className="max-w-[85%] rounded-lg p-2 text-sm break-words whitespace-pre-wrap bg-gray-800 text-gray-200">
                    {streamingText}
                    <span className="inline-block w-1.5 h-4 ml-0.5 bg-indigo-400 animate-pulse align-text-bottom rounded-sm" />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-2 flex gap-2">
              <div className="relative w-full">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, 500))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      if (!awaitingReply) send()
                    }
                  }}
                  maxLength={500}
                  placeholder={
                    awaitingReply ? 'Waiting for reply...' : 'Type a message...'
                  }
                  disabled={awaitingReply}
                  className={`w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none ${awaitingReply ? 'opacity-70' : ''}`}
                />
                {input.length > 400 && (
                  <span className={`absolute right-2 -top-5 text-xs ${input.length >= 500 ? 'text-red-400' : 'text-gray-500'}`}>
                    {input.length}/500
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!awaitingReply) send()
                }}
                disabled={awaitingReply}
                className={`rounded px-3 py-2 text-sm font-medium text-white ${awaitingReply ? 'bg-indigo-500 opacity-70 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'}`}
              >
                {awaitingReply ? (
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    role="img"
                  >
                    <title>Loading</title>
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      strokeWidth={3}
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  'Send'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
