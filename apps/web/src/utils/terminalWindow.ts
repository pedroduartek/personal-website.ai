export const OPEN_TERMINAL_WINDOW_EVENT = 'pedroduartek:open-terminal-window'

export function openTerminalWindow() {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new Event(OPEN_TERMINAL_WINDOW_EVENT))
}
