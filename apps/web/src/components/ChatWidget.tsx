import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ollamaIcon from '../images/ollama.png'

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

// Drop-bounce entrance animation for the chat icon.
// The button is position:fixed bottom:24px, so translateY(-Y) moves it UP.
// We animate from far above the viewport down to 0 with bounces.
const dropBounceKeyframes = `
@keyframes dropBounce {
  0%   { transform: translateY(calc(-100vh - 60px)); opacity: 0; }
  8%   { opacity: 1; }
  30%  { transform: translateY(0); }
  45%  { transform: translateY(-40px); }
  60%  { transform: translateY(0); }
  72%  { transform: translateY(-14px); }
  84%  { transform: translateY(0); }
  100% { transform: translateY(0); }
}
`

// subtle drawer enter/exit animations
const drawerKeyframes = `
@keyframes drawerIn {
  0% { transform: translateY(12px) scale(.985); opacity: 0 }
  100% { transform: translateY(0) scale(1); opacity: 1 }
}
@keyframes drawerOut {
  0% { transform: translateY(0) scale(1); opacity: 1 }
  100% { transform: translateY(12px) scale(.985); opacity: 0 }
}
`

type Message = { id: number; text: string; from: 'user' | 'bot' }

// Resize constraints
const MIN_WIDTH = 320
const MIN_HEIGHT = 300
const MAX_WIDTH = 800
const MAX_HEIGHT = 800
const DEFAULT_WIDTH = 320
const DEFAULT_HEIGHT = 340

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [hasEntered, setHasEntered] = useState(false)
  const [animationDone, setAnimationDone] = useState(false)
  // track whether the initial bounce has already played (persist during component lifecycle)
  const bouncePlayedRef = useRef(false)
  // keep drawer mounted during exit animation
  const [renderDrawer, setRenderDrawer] = useState(open)
  const [apiHealthy, setApiHealthy] = useState<boolean | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const containerRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [awaitingReply, setAwaitingReply] = useState(false)
  const [placeholderWords, setPlaceholderWords] = useState(0)
  const placeholderIntervalRef = useRef<number | null>(null)
  const placeholderWidths = [40, 65, 35, 50, 60, 30, 45, 55, 38, 48, 62, 34]
  const [showNote, setShowNote] = useState(true)

  // --- Resize state (desktop only) ---
  const [chatSize, setChatSize] = useState({
    w: DEFAULT_WIDTH,
    h: DEFAULT_HEIGHT,
  })
  const resizing = useRef<{
    edge: string
    startX: number
    startY: number
    startW: number
    startH: number
  } | null>(null)

  const isDesktop = useCallback(() => window.innerWidth >= 768, [])

  const onResizeStart = useCallback(
    (edge: string) => (e: React.MouseEvent) => {
      if (!isDesktop()) return
      e.preventDefault()
      resizing.current = {
        edge,
        startX: e.clientX,
        startY: e.clientY,
        startW: chatSize.w,
        startH: chatSize.h,
      }

      const onMouseMove = (ev: MouseEvent) => {
        if (!resizing.current) return
        const { edge, startX, startY, startW, startH } = resizing.current
        let newW = startW
        let newH = startH
        if (edge.includes('left')) {
          newW = Math.min(
            MAX_WIDTH,
            Math.max(MIN_WIDTH, startW - (ev.clientX - startX)),
          )
        }
        if (edge.includes('top')) {
          newH = Math.min(
            MAX_HEIGHT,
            Math.max(MIN_HEIGHT, startH - (ev.clientY - startY)),
          )
        }
        setChatSize({ w: newW, h: newH })
      }

      const onMouseUp = () => {
        resizing.current = null
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
      document.body.style.userSelect = 'none'
    },
    [chatSize, isDesktop],
  )

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

  async function send() {
    if (awaitingReply) return
    if (!input.trim()) return
    if (!apiHealthy) {
      setMessages((s) => [
        ...s,
        {
          id: Date.now() + 1,
          text: 'Sorry, the chat service is unavailable right now. Please try again later.',
          from: 'bot',
        },
      ])
      return
    }
    const text = input.trim()
    const msg: Message = { id: Date.now(), text, from: 'user' }
    setMessages((s) => [...s, msg])
    setInput('')
    setAwaitingReply(true)
    const apiUrl = import.meta.env.DEV
      ? '/api/chat'
      : 'https://api.pedroduartek.com/chat'

    try {
      const maxAttempts = 2
      let res: Response | null = null
      let lastErr: unknown = null

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text }),
          })
          if (res.ok) break
          lastErr = new Error(`HTTP ${res.status}`)
        } catch (e) {
          lastErr = e
        }
      }

      if (!res || !res.ok) {
        try {
          console.error('ChatWidget fetch failed after retries:', lastErr)
        } catch {}
        setMessages((s) => [
          ...s,
          {
            id: Date.now() + 1,
            text: 'Sorry, the chat service is unavailable right now. Please try again later.',
            from: 'bot',
          },
        ])
        setAwaitingReply(false)
        return
      }

      const data = await res.json()
      const reply =
        typeof data === 'string'
          ? data
          : data && typeof data === 'object'
            ? (data.answer ??
              data.reply ??
              data.message ??
              JSON.stringify(data))
            : String(data)

      try {
        const textReply = String(reply)
        const urlRegex = /(https?:\/\/[^\s]+)|\/(?!\d)[^\s]+/g
        const matches = Array.from(textReply.matchAll(urlRegex)).map(
          (m) => m[0],
        )
        if (matches.length > 0) {
          let hasInternal = false
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
            if (pathname && isInternalRoute(pathname)) {
              hasInternal = true
              break
            }
          }
          if (!hasInternal) {
            setMessages((s) => [
              ...s,
              {
                id: Date.now() + 1,
                text: 'Unable to find a response to your question',
                from: 'bot',
              },
            ])
            setAwaitingReply(false)
            return
          }
        }
      } catch (e) {
        // if URL parsing fails, fall back to showing the reply
      }

      setMessages((s) => [
        ...s,
        { id: Date.now() + 1, text: String(reply), from: 'bot' },
      ])
      setAwaitingReply(false)
    } catch (err: unknown) {
      try {
        console.error('ChatWidget error:', err)
      } catch {}
      setMessages((s) => [
        ...s,
        {
          id: Date.now() + 1,
          text: 'Sorry, the chat service is unavailable right now. Please try again later.',
          from: 'bot',
        },
      ])
      setAwaitingReply(false)
    }
  }

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const el = containerRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior })
  }, [])

  // Focus input when opening
  useEffect(() => {
    // Only autofocus on desktop; on mobile let the user tap the input explicitly
    if (open && isDesktop()) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open, isDesktop])

  // Keep drawer mounted briefly when closing to allow exit animation
  useEffect(() => {
    if (open) {
      setRenderDrawer(true)
      return
    }
    // when closing, wait for the exit transition to finish
    const t = setTimeout(() => setRenderDrawer(false), 260)
    return () => clearTimeout(t)
  }, [open])

  // Always follow latest message (including when a placeholder is shown)
  useEffect(() => {
    // when awaitingReply is true we let the placeholder effect control scrolling
    if (awaitingReply) return
    scrollToBottom('smooth')
  }, [awaitingReply, scrollToBottom])

  // Simulate streaming words while awaiting a reply
  useEffect(() => {
    const maxWords = 12
    if (awaitingReply) {
      setPlaceholderWords(0)
      // use window.setInterval so TS infers number
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
  }, [awaitingReply])

  // Scroll the last placeholder word into view so the bottom aligns with the container
  useEffect(() => {
    if (!awaitingReply) return
    const el = containerRef.current
    if (!el) return
    const lastIndex = Math.min(placeholderWords, placeholderWidths.length) - 1
    if (lastIndex < 0) return
    const selector = `[data-placeholder-last="${lastIndex}"]`
    const node = el.querySelector(selector) as HTMLElement | null
    if (node) {
      // compute scrollTop so the container is scrolled ~10px below the last placeholder
      const nodeBottom = node.offsetTop + node.offsetHeight
      const desiredTop = nodeBottom - el.clientHeight + 10
      const top = Math.max(0, desiredTop)
      el.scrollTo({ top, behavior: 'smooth' })
    }
  }, [placeholderWords, awaitingReply])

  // Check API health on mount; only show widget if healthy
  useEffect(() => {
    let cancelled = false
    const healthUrl = import.meta.env.DEV
      ? '/api/health'
      : 'https://api.pedroduartek.com/health'

    fetch(healthUrl, { method: 'GET' })
      .then((res) => {
        if (!cancelled) setApiHealthy(res.ok)
      })
      .catch(() => {
        if (!cancelled) setApiHealthy(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  // Trigger the entrance animation after a short delay once API is healthy
  useEffect(() => {
    if (apiHealthy !== true) return
    const timer = setTimeout(() => setHasEntered(true), 500)
    return () => clearTimeout(timer)
  }, [apiHealthy])

  // Don't render anything until health check passes
  if (apiHealthy !== true) return null

  return (
    <>
      <style>
        {typingKeyframes +
          scrollbarStyles +
          dropBounceKeyframes +
          drawerKeyframes}
      </style>
      {/* Floating Button (only when closed) */}
      {!open && (
        <button
          type="button"
          aria-label="Open chat"
          onClick={() => setOpen(true)}
          onAnimationEnd={() => {
            setAnimationDone(true)
            // mark bounce as played so it won't run again during this session
            bouncePlayedRef.current = true
          }}
          className={`fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg focus:outline-none overflow-hidden ${
            animationDone
              ? 'transition-all duration-200 hover:scale-110 hover:shadow-xl hover:shadow-indigo-500/30'
              : ''
          }`}
          style={{
            backgroundColor: '#1D4ED8',
            // before entrance keep it off-screen; play bounce once after entrance;
            // afterwards keep it visible in place
            ...(!hasEntered
              ? { transform: 'translateY(calc(-100vh - 60px))', opacity: 0 }
              : !bouncePlayedRef.current
                ? {
                    animation:
                      'dropBounce 2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                  }
                : { transform: 'translateY(0)', opacity: 1 }),
          }}
        >
          <img
            src={ollamaIcon}
            alt="Chat bot"
            className="h-10 w-10 object-contain rounded-full"
          />
        </button>
      )}

      {/* Chat Drawer */}
      {renderDrawer && (
        <div
          className="fixed right-6 bottom-6 z-50 max-w-full transform-gpu rounded-lg bg-gray-900 shadow-xl flex flex-col overflow-hidden"
          style={{
            transition: 'pointer-events 1ms linear',
            // animate using keyframes so the easing feels consistent
            animation: open
              ? 'drawerIn 220ms cubic-bezier(.2,.9,.2,1) forwards'
              : 'drawerOut 220ms cubic-bezier(.2,.9,.2,1) forwards',
            transformOrigin: 'right bottom',
            pointerEvents: open ? 'auto' : 'none',
            ...(isDesktop()
              ? { width: chatSize.w, height: chatSize.h }
              : { width: 320, height: DEFAULT_HEIGHT }),
            border: '3px solid #1D4ED7',
          }}
        >
          {/* Resize handles — desktop only */}
          {isDesktop() && (
            <>
              {/* Top-left corner */}
              <div
                onMouseDown={onResizeStart('top-left')}
                className="absolute -top-1 -left-1 z-10 h-4 w-4 cursor-nwse-resize"
              />
              {/* Top edge */}
              <div
                onMouseDown={onResizeStart('top')}
                className="absolute -top-1 left-3 right-0 z-10 h-2 cursor-ns-resize"
              />
              {/* Left edge */}
              <div
                onMouseDown={onResizeStart('left')}
                className="absolute top-3 -left-1 bottom-0 z-10 w-2 cursor-ew-resize"
              />
            </>
          )}
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
              This is a basic POC. Responses may be inaccurate. It only uses
              content from this website to reply to your questions.
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
          <div
            className="relative flex flex-col gap-2 overflow-hidden p-3"
            style={{ flex: '1 1 0%', minHeight: 0 }}
          >
            <div
              ref={containerRef}
              className="flex-1 overflow-auto overflow-x-hidden custom-scrollbar pr-[5px]"
            >
              <div className="flex flex-col gap-2">
                {messages.length === 0 && (
                  <div className="text-sm text-gray-400">
                    Hey! 👋
                    <br />
                    <br />
                    I'm Pedro's AI assistant. Ask me anything about his
                    experience, skills, projects, or background. I'll find the
                    answer from this website for you.
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
                          const rawText: string = m.text

                          // Helper: parse inline URLs in a text segment
                          const parseUrls = (
                            segment: string,
                            keyPrefix: string,
                          ): React.ReactNode[] => {
                            // Only consider slash-starting paths that are not just numeric
                            const urlRegex =
                              /(https?:\/\/[^\s]+)|\/(?!\d)[^\s]+/g
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

                          // Normalize: insert newlines before numbered items and dash/star bullets
                          // that appear inline (preceded by non-newline chars)
                          let text = rawText
                          // newline before numbered items like "1. " or "2. "
                          text = text.replace(/(?<!\n)(\d+\.\s)/g, '\n$1')
                          // newline before indented dash bullets like "   - item"
                          text = text.replace(/(?<!\n)(\s{2,}-\s)/g, '\n$1')

                          // Split into lines and classify each
                          const lines = text.split('\n')
                          type LineInfo =
                            | { type: 'numbered'; label: string }
                            | { type: 'bullet'; content: string }
                            | { type: 'text'; content: string }
                          const classified: LineInfo[] = lines.map((line) => {
                            const numberedMatch = line.match(/^\s*(\d+\.\s+.*)/)
                            if (numberedMatch) {
                              return {
                                type: 'numbered',
                                label: numberedMatch[1].trim(),
                              }
                            }
                            const bulletMatch = line.match(/^\s*[-*]\s+(.*)/)
                            if (bulletMatch) {
                              return { type: 'bullet', content: bulletMatch[1] }
                            }
                            return { type: 'text', content: line }
                          })

                          // Group consecutive same-type lines, but numbered + following bullets stay together
                          type Group =
                            | { type: 'text'; lines: string[] }
                            | { type: 'bullets'; lines: string[] }
                            | {
                                type: 'section'
                                label: string
                                items: string[]
                              }
                          const groups: Group[] = []

                          for (const cl of classified) {
                            if (cl.type === 'numbered') {
                              groups.push({
                                type: 'section',
                                label: cl.label,
                                items: [],
                              })
                            } else if (cl.type === 'bullet') {
                              // attach to preceding section if exists, otherwise standalone bullet group
                              const last = groups[groups.length - 1]
                              if (last && last.type === 'section') {
                                last.items.push(cl.content)
                              } else if (last && last.type === 'bullets') {
                                last.lines.push(cl.content)
                              } else {
                                groups.push({
                                  type: 'bullets',
                                  lines: [cl.content],
                                })
                              }
                            } else {
                              // plain text
                              const last = groups[groups.length - 1]
                              if (last && last.type === 'text') {
                                last.lines.push(cl.content)
                              } else {
                                groups.push({
                                  type: 'text',
                                  lines: [cl.content],
                                })
                              }
                            }
                          }

                          return groups.map((group, gi) => {
                            if (group.type === 'section') {
                              return (
                                <div key={`${m.id}-g${gi}`} className="my-1">
                                  <strong className="text-gray-100">
                                    {parseUrls(group.label, `${m.id}-g${gi}-h`)}
                                  </strong>
                                  {group.items.length > 0 && (
                                    <ul className="list-disc list-inside space-y-0.5 mt-0.5 ml-2">
                                      {group.items.map((item, li) => (
                                        <li key={`${m.id}-g${gi}-li${li}`}>
                                          {parseUrls(
                                            item,
                                            `${m.id}-g${gi}-li${li}`,
                                          )}
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              )
                            }
                            if (group.type === 'bullets') {
                              return (
                                <ul
                                  key={`${m.id}-g${gi}`}
                                  className="list-disc list-inside space-y-0.5 my-1"
                                >
                                  {group.lines.map((line, li) => (
                                    <li key={`${m.id}-g${gi}-li${li}`}>
                                      {parseUrls(
                                        line,
                                        `${m.id}-g${gi}-li${li}`,
                                      )}
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
                {awaitingReply && (
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
                          // keep skeleton blinking for all generated/visible words
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
                  <span
                    className={`absolute right-2 -top-5 text-xs ${input.length >= 500 ? 'text-red-400' : 'text-gray-500'}`}
                  >
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
                className={`rounded px-3 py-2 text-sm font-medium text-white ${awaitingReply ? 'opacity-70 cursor-not-allowed' : 'hover:brightness-110'}`}
                style={{ backgroundColor: '#1D4ED8' }}
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
