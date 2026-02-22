import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const selectedItemRef = useRef<HTMLButtonElement>(null)
  const navigate = useNavigate()

  const commands: Command[] = [
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

  if (!isOpen) return null

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Keyboard events handled by window listener in useEffect
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      aria-label="Close command palette"
    >
      <div className="flex min-h-screen items-start justify-center p-4 pt-[20vh]">
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: Click handler only prevents event bubbling */}
        <div
          className="w-full max-w-2xl rounded-lg border border-gray-700 bg-gray-900 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          aria-modal="true"
          aria-label="Command palette"
        >
          {/* Search Input */}
          <div className="border-b border-gray-700 p-4">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type a command or search..."
              className="w-full bg-transparent text-lg text-white outline-none placeholder:text-gray-500"
            />
          </div>

          {/* Commands List */}
          <div className="max-h-96 overflow-y-auto p-2">
            {filteredCommands.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
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
                        : 'text-gray-300 hover:bg-gray-800'
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
                              : 'text-gray-500'
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
                          : 'text-gray-600'
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
          <div className="border-t border-gray-700 px-4 py-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex gap-4">
                <span>
                  <kbd className="rounded bg-gray-800 px-1.5 py-0.5">↑↓</kbd>{' '}
                  Navigate
                </span>
                <span>
                  <kbd className="rounded bg-gray-800 px-1.5 py-0.5">Enter</kbd>{' '}
                  Select
                </span>
                <span>
                  <kbd className="rounded bg-gray-800 px-1.5 py-0.5">Esc</kbd>{' '}
                  Close
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
