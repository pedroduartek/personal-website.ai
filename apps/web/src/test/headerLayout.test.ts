import { describe, expect, it } from 'vitest'
import {
  isKeyboardCapableDevice,
  resolveHeaderLayout,
} from '../utils/headerLayout'

describe('headerLayout helpers', () => {
  it('detects keyboard-capable devices through pointer and hover capability', () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: (query: string) => ({
        matches: query === '(any-hover: hover) and (any-pointer: fine)',
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }),
    })

    expect(isKeyboardCapableDevice()).toBe(true)
  })

  it('shows desktop navigation and command palette when both fit', () => {
    expect(
      resolveHeaderLayout({
        commandButtonWidth: 320,
        containerWidth: 1700,
        desktopControlsWidth: 900,
        keyboardCapable: true,
        logoWidth: 280,
      }),
    ).toEqual({
      showCommandButton: true,
      showDesktopNav: true,
    })
  })

  it('keeps desktop navigation and hides the command palette first when space gets tight', () => {
    expect(
      resolveHeaderLayout({
        commandButtonWidth: 320,
        containerWidth: 1300,
        desktopControlsWidth: 900,
        keyboardCapable: true,
        logoWidth: 280,
      }),
    ).toEqual({
      showCommandButton: false,
      showDesktopNav: true,
    })
  })

  it('falls back to hamburger mode without bringing back the command palette', () => {
    expect(
      resolveHeaderLayout({
        commandButtonWidth: 320,
        containerWidth: 1000,
        desktopControlsWidth: 900,
        keyboardCapable: true,
        logoWidth: 280,
      }),
    ).toEqual({
      showCommandButton: false,
      showDesktopNav: false,
    })
  })

  it('never shows the command palette on touch-first devices', () => {
    expect(
      resolveHeaderLayout({
        commandButtonWidth: 320,
        containerWidth: 1700,
        desktopControlsWidth: 900,
        keyboardCapable: false,
        logoWidth: 280,
      }),
    ).toEqual({
      showCommandButton: false,
      showDesktopNav: true,
    })
  })
})
