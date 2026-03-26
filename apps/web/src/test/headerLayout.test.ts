import { describe, expect, it } from 'vitest'
import {
  canShowHeaderCommandPalette,
  isKeyboardCapableDevice,
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

  it('hides the header command palette on narrow viewports even on keyboard devices', () => {
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

    expect(canShowHeaderCommandPalette(375)).toBe(false)
    expect(canShowHeaderCommandPalette(560)).toBe(true)
  })
})
