export const OPEN_COMMAND_PALETTE_EVENT = 'pedroduartek:open-command-palette'

export function markCommandPaletteUsed() {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.setItem('commandPaletteUsed', '1')
    localStorage.setItem('commandPaletteTipDismissed', '1')
  } catch (error) {
    // ignore
  }
}

export function openCommandPalette() {
  if (typeof window === 'undefined') {
    return
  }

  markCommandPaletteUsed()
  window.dispatchEvent(new Event(OPEN_COMMAND_PALETTE_EVENT))
}
