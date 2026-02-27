import React, { useState, useRef, useEffect, useCallback } from 'react'

// small keyframes for typing dots animation (inlined style fallback)
const typingKeyframes = `@keyframes typing { 0% { transform: translateY(0); opacity: 0.3 } 50% { transform: translateY(-4px); opacity: 1 } 100% { transform: translateY(0); opacity: 0.3 } }`

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
  const [placeholderWords, setPlaceholderWords] = useState(0)
  const placeholderIntervalRef = useRef<number | null>(null)
  const placeholderWidths = [40, 65, 35, 50, 60, 30, 45, 55, 38, 48, 62, 34]

  async function send() {
    if (awaitingReply) return
    if (!input.trim()) return
    const text = input.trim()
    const msg: Message = { id: Date.now(), text, from: 'user' }
    setMessages((s) => [...s, msg])
    setInput('')
    setAwaitingReply(true)
    const apiUrl = import.meta.env.DEV ? '/api/chat' : 'https://api.pedroduartek.com/chat'

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })

      if (!res.ok) {
        const body = await res.text()
        setMessages((s) => [
          ...s,
          { id: Date.now() + 1, text: `Error: ${res.status} ${body}`, from: 'bot' },
        ])
        setAwaitingReply(false)
        return
      }

      const data = await res.json()
      const reply = typeof data === 'string'
        ? data
        : (data && typeof data === 'object'
          ? (data.answer ?? data.reply ?? data.message ?? JSON.stringify(data))
          : String(data))
      setMessages((s) => [...s, { id: Date.now() + 1, text: String(reply), from: 'bot' }])
      setAwaitingReply(false)
    } catch (err: any) {
      setMessages((s) => [
        ...s,
        { id: Date.now() + 1, text: `Network error: ${err?.message ?? String(err)}`, from: 'bot' },
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
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // Always follow latest message (including when a placeholder is shown)
  useEffect(() => {
    // when awaitingReply is true we let the placeholder effect control scrolling
    if (awaitingReply) return
    scrollToBottom('smooth')
  }, [messages, awaitingReply, scrollToBottom])

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
  }, [placeholderWords, awaitingReply, placeholderWidths])

  return (
    <>
      <style>{typingKeyframes + scrollbarStyles}</style>
      {/* Floating Button */}
      <button
        aria-label={open ? 'Close chat' : 'Open chat'}
        onClick={() => setOpen((v) => !v)}
        className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 p-2 text-white shadow-lg hover:bg-indigo-500 focus:outline-none"
      >
        {open ? (
          // X icon
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          // Robot face icon
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="7" width="18" height="11" rx="2" strokeWidth={2} />
            <rect x="8" y="3" width="8" height="4" rx="1" strokeWidth={2} />
            <circle cx="9" cy="12" r="1.25" fill="currentColor" />
            <circle cx="15" cy="12" r="1.25" fill="currentColor" />
            <path d="M8 16c1 1 3 1 4 1s3 0 4-1" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Chat Drawer */}
      {open && (
        <div className="fixed right-6 bottom-20 z-50 w-80 max-w-full transform-gpu rounded-lg bg-gray-900 shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-800 px-3 py-2">
            <div className="text-sm font-medium text-white">Chat</div>
            <button
              onClick={() => setOpen(false)}
              className="rounded p-1 text-gray-300 hover:text-white"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>
          <div className="px-3 py-2 text-xs text-yellow-100 bg-yellow-700/10 border-t border-yellow-700/20">
            <strong className="font-medium">Note: </strong> 
            This chat AI is a primitive proof-of-concept (POC). It is limited and may be incorrect — do not trust it for important or sensitive decisions. It was told to only reply using the content of this website.
          </div>
          <div className="relative flex h-72 flex-col gap-2 overflow-hidden p-3">
            <div ref={containerRef} className="flex-1 overflow-auto overflow-x-hidden custom-scrollbar">
              <div className="flex flex-col gap-2">
                {messages.length === 0 && (
                  <div className="text-sm text-gray-400">
                    Hey!👋<br /><br />
                  Ask me any questions about Pedro Duarte, if I can find that information in this website I'll tell you.</div>
                )}
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[85%] rounded-lg p-2 text-sm break-words whitespace-pre-wrap ${
                      m.from === 'user' ? 'ml-auto bg-indigo-700 text-white' : 'bg-gray-800 text-gray-200'
                    }`}
                  >
                    {m.text}
                  </div>
                ))}
                {awaitingReply && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="max-w-[80%] rounded-lg p-2 text-sm bg-gray-800 text-gray-400"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      {(() => {
                        const lastIndex = Math.min(placeholderWords, placeholderWidths.length) - 1
                        return placeholderWidths.map((w, i) => {
                          const key = `ph-${i}`
                          const style: React.CSSProperties = { width: `${w}%` }
                          // keep skeleton blinking for all generated/visible words
                          if (i <= placeholderWords) {
                            return (
                              <span
                                key={key}
                                data-placeholder-last={i === lastIndex ? String(i) : undefined}
                                className="inline-block h-3 rounded bg-gray-600 animate-pulse"
                                style={style}
                              />
                            )
                          }
                          return null
                        })
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </div>

            

            <div className="mt-2 flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    if (!awaitingReply) send()
                  }
                }}
                placeholder={awaitingReply ? 'Waiting for reply...' : 'Type a message...'}
                disabled={awaitingReply}
                className={`w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none ${awaitingReply ? 'opacity-70' : ''}`}
              />
              <button
                onClick={() => { if (!awaitingReply) send() }}
                disabled={awaitingReply}
                className={`rounded px-3 py-2 text-sm font-medium text-white ${awaitingReply ? 'bg-indigo-500 opacity-70 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'}`}
              >
                {awaitingReply ? (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth={3} strokeLinecap="round" />
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
