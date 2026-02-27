import React, { useState } from 'react'

type Message = { id: number; text: string; from: 'user' | 'bot' }

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])

  async function send() {
    if (!input.trim()) return
    const text = input.trim()
    const msg: Message = { id: Date.now(), text, from: 'user' }
    setMessages((s) => [...s, msg])
    setInput('')
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
        return
      }

      const data = await res.json()
      const reply = typeof data === 'string'
        ? data
        : (data && typeof data === 'object'
          ? (data.answer ?? data.reply ?? data.message ?? JSON.stringify(data))
          : String(data))
      setMessages((s) => [...s, { id: Date.now() + 1, text: String(reply), from: 'bot' }])
    } catch (err: any) {
      setMessages((s) => [
        ...s,
        { id: Date.now() + 1, text: `Network error: ${err?.message ?? String(err)}`, from: 'bot' },
      ])
    }
  }

  return (
    <>
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
          <div className="flex h-72 flex-col gap-2 overflow-hidden p-3">
            <div className="flex-1 overflow-auto">
              <div className="flex flex-col gap-2">
                {messages.length === 0 && (
                  <div className="text-sm text-gray-400">Say hello 👋</div>
                )}
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[85%] rounded-lg p-2 text-sm ${
                      m.from === 'user' ? 'ml-auto bg-indigo-700 text-white' : 'bg-gray-800 text-gray-200'
                    }`}
                  >
                    {m.text}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-2 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') send()
                }}
                placeholder="Type a message..."
                className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none"
              />
              <button
                onClick={send}
                className="rounded bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
