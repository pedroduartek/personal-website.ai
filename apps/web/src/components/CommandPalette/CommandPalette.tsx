import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import cvPdf from '../../CV/Pedro_Duarte_CV.pdf'
import { useTheme } from '../../app/theme/ThemeProvider'
import { profile } from '../../content/profile'
import { useChatAvailability } from '../../hooks/useChatAvailability'
import { openChatWidget } from '../../utils/chatWidget'
import { isKeyboardCapableDevice } from '../../utils/headerLayout'

interface Command {
  id: string
  label: string
  description?: string
  icon?: string
  action: () => void
  category: 'navigation' | 'action'
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

interface ClipboardNotice {
  id: number
  message: string
}

async function copyTextToClipboard(value: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return true
  }

  if (typeof document === 'undefined') {
    return false
  }

  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.setAttribute('readonly', 'true')
  textarea.style.position = 'absolute'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()

  try {
    return document.execCommand?.('copy') ?? false
  } finally {
    document.body.removeChild(textarea)
  }
}

function openExternalUrl(url: string) {
  if (typeof window === 'undefined') {
    return
  }

  window.open(url, '_blank', 'noopener,noreferrer')
}

function downloadFile(url: string, fileName: string) {
  if (typeof document === 'undefined') {
    return
  }

  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.rel = 'noopener'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [clipboardNotice, setClipboardNotice] =
    useState<ClipboardNotice | null>(null)
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [keyboardCapable, setKeyboardCapable] = useState(() =>
    isKeyboardCapableDevice(),
  )
  const inputRef = useRef<HTMLInputElement>(null)
  const selectedItemRef = useRef<HTMLButtonElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const chatAvailable = useChatAvailability()
  const { toggleTheme } = useTheme()
  const shortcutLabel =
    typeof navigator !== 'undefined' &&
    /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)
      ? '⌘K'
      : 'Ctrl+K'

  useEffect(() => {
    if (!clipboardNotice) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setClipboardNotice((currentNotice) =>
        currentNotice?.id === clipboardNotice.id ? null : currentNotice,
      )
    }, 4000)

    return () => window.clearTimeout(timeoutId)
  }, [clipboardNotice])

  async function handleCopyEmail() {
    try {
      const didCopy = await copyTextToClipboard(profile.email)

      if (didCopy) {
        setClipboardNotice((currentNotice) => ({
          id: (currentNotice?.id ?? 0) + 1,
          message: `Email ${profile.email} was copied to your clipboard.`,
        }))
      }
    } finally {
      onClose()
    }
  }

  useEffect(() => {
    const updateKeyboardCapability = () => {
      setKeyboardCapable(isKeyboardCapableDevice())
    }

    updateKeyboardCapability()
    window.addEventListener('resize', updateKeyboardCapability)
    return () => window.removeEventListener('resize', updateKeyboardCapability)
  }, [])

  const actionCommands: Command[] = [
    {
      id: 'toggle-theme',
      label: 'Toggle Theme',
      description: 'Switch between light and dark mode',
      icon: '🌓',
      action: () => {
        toggleTheme()
        onClose()
      },
      category: 'action',
    },
    {
      id: 'copy-email',
      label: 'Copy Email Address',
      description: `Copy ${profile.email} to clipboard`,
      icon: '📋',
      action: () => {
        void handleCopyEmail()
      },
      category: 'action',
    },
    {
      id: 'open-github',
      label: 'Open GitHub',
      description: 'Open Pedro Duarte’s GitHub profile',
      icon: '🐙',
      action: () => {
        if (profile.github) {
          openExternalUrl(profile.github)
        }
        onClose()
      },
      category: 'action',
    },
    {
      id: 'open-linkedin',
      label: 'Open LinkedIn',
      description: 'Open Pedro Duarte’s LinkedIn profile',
      icon: '💙',
      action: () => {
        openExternalUrl(profile.linkedin)
        onClose()
      },
      category: 'action',
    },
    {
      id: 'download-cv-now',
      label: 'Download CV Now',
      description: 'Download the PDF directly',
      icon: '⬇️',
      action: () => {
        downloadFile(cvPdf, `${profile.name.replace(/\s+/g, '_')}_CV.pdf`)
        onClose()
      },
      category: 'action',
    },
  ]

  if (chatAvailable === true) {
    actionCommands.push({
      id: 'start-ai-assistant',
      label: 'Start AI Assistant Conversation',
      description: 'Open the AI assistant chat widget',
      icon: '🤖',
      action: () => {
        openChatWidget()
        onClose()
      },
      category: 'action',
    })
  }

  const navigationCommands: Command[] = [
    {
      id: 'home',
      label: 'Home',
      description: 'Go to homepage',
      icon: '🏠',
      action: () => {
        navigate('/')
        onClose()
      },
      category: 'navigation',
    },
    {
      id: 'about',
      label: 'About',
      description: 'Learn about me',
      icon: '👤',
      action: () => {
        navigate('/about')
        onClose()
      },
      category: 'navigation',
    },
    {
      id: 'experience',
      label: 'Experience',
      description: 'View work experience',
      icon: '💼',
      action: () => {
        navigate('/experience')
        onClose()
      },
      category: 'navigation',
    },
    {
      id: 'projects',
      label: 'Projects',
      description: 'Browse my projects',
      icon: '🚀',
      action: () => {
        navigate('/projects')
        onClose()
      },
      category: 'navigation',
    },
    {
      id: 'education',
      label: 'Education',
      description: 'View education and certifications',
      icon: '🎓',
      action: () => {
        navigate('/education')
        onClose()
      },
      category: 'navigation',
    },
    {
      id: 'skills',
      label: 'Skills',
      description: 'Explore my technical skills',
      icon: '⚡',
      action: () => {
        navigate('/skills')
        onClose()
      },
      category: 'navigation',
    },
    {
      id: 'contact',
      label: 'Contact',
      description: 'Get in touch',
      icon: '✉️',
      action: () => {
        navigate('/contact')
        onClose()
      },
      category: 'navigation',
    },
    {
      id: 'cv',
      label: 'Download CV',
      description: 'View and download CV',
      icon: '📄',
      action: () => {
        navigate('/cv')
        onClose()
      },
      category: 'navigation',
    },
  ]

  if (keyboardCapable) {
    navigationCommands.push({
      id: 'terminal',
      label: 'Terminal',
      description: 'Open terminal-style shell',
      icon: '🖥️',
      action: () => {
        const from = `${location.pathname}${location.search}${location.hash}`
        navigate('/terminal', {
          state: from !== '/terminal' ? { from } : undefined,
        })
        onClose()
      },
      category: 'navigation',
    })
  }

  const commands: Command[] = [...actionCommands, ...navigationCommands]

  const filteredCommands = commands.filter((command) => {
    const searchLower = search.toLowerCase()
    return (
      command.label.toLowerCase().includes(searchLower) ||
      command.description?.toLowerCase().includes(searchLower) ||
      command.category.toLowerCase().includes(searchLower)
    )
  })

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
      setSearch('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  // biome-ignore lint/correctness/useExhaustiveDependencies: Need to reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  useEffect(() => {
    setSelectedIndex((prev) =>
      filteredCommands.length === 0
        ? 0
        : Math.min(prev, filteredCommands.length - 1),
    )
  }, [filteredCommands.length])

  // biome-ignore lint/correctness/useExhaustiveDependencies: Need to scroll when selection changes
  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      })
    }
  }, [selectedIndex])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev < filteredCommands.length - 1 ? prev + 1 : prev,
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredCommands, selectedIndex, onClose])

  if (!isOpen && !clipboardNotice) return null

  return (
    <>
      {clipboardNotice ? (
        <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex justify-center sm:justify-end">
          <output
            aria-live="polite"
            className="block w-full max-w-md rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800 shadow-lg backdrop-blur-sm dark:text-emerald-200"
          >
            {clipboardNotice.message}
          </output>
        </div>
      ) : null}

      {isOpen ? (
        // biome-ignore lint/a11y/useKeyWithClickEvents: Keyboard events handled by window listener in useEffect
        <div
          className="fixed inset-0 z-50 bg-overlay/55 backdrop-blur-sm"
          onClick={onClose}
          aria-label="Close command palette"
        >
          <div className="flex min-h-screen items-start justify-center p-4 pt-[20vh]">
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: Click handler only prevents event bubbling */}
            <div
              className="theme-card w-full max-w-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              aria-modal="true"
              aria-label="Command palette"
            >
              {/* Search Input */}
              <div className="p-4">
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Go to a page or run a command..."
                  className="theme-input text-lg"
                />
              </div>

              {/* Commands List */}
              <div className="custom-scrollbar max-h-96 overflow-y-auto border-t border-border p-2">
                {filteredCommands.length === 0 ? (
                  <div className="px-4 py-8 text-center text-foreground-subtle">
                    No commands found
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredCommands.map((command, index) => (
                      <button
                        key={command.id}
                        type="button"
                        ref={index === selectedIndex ? selectedItemRef : null}
                        onClick={command.action}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`flex w-full items-center gap-3 rounded-md px-4 py-3 text-left transition-colors ${
                          index === selectedIndex
                            ? 'bg-blue-600 text-white'
                            : 'text-foreground-muted hover:bg-surface-muted hover:text-foreground'
                        }`}
                      >
                        <span className="text-xl">{command.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium">{command.label}</div>
                          {command.description && (
                            <div
                              className={`text-sm ${
                                index === selectedIndex
                                  ? 'text-blue-200'
                                  : 'text-foreground-subtle'
                              }`}
                            >
                              {command.description}
                            </div>
                          )}
                        </div>
                        <span
                          className={`text-xs ${
                            index === selectedIndex
                              ? 'text-blue-200'
                              : 'text-foreground-subtle'
                          }`}
                        >
                          {command.category}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-border px-4 py-2">
                <div className="flex items-center justify-between text-xs text-foreground-subtle">
                  <div className="flex gap-4">
                    <span>
                      <kbd className="theme-kbd">{shortcutLabel}</kbd> Open
                    </span>
                    <span>
                      <kbd className="theme-kbd">↑↓</kbd> Navigate
                    </span>
                    <span>
                      <kbd className="theme-kbd">Enter</kbd> Select
                    </span>
                    <span>
                      <kbd className="theme-kbd">Esc</kbd> Close
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
