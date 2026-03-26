export type HeaderLayoutInput = {
  commandButtonWidth: number
  desktopControlsWidth: number
  gap?: number
  keyboardCapable: boolean
  logoWidth: number
  containerWidth: number
}

export type HeaderLayout = {
  showCommandButton: boolean
  showDesktopNav: boolean
}

export function isKeyboardCapableDevice() {
  if (
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function'
  ) {
    return true
  }

  return window.matchMedia('(any-hover: hover) and (any-pointer: fine)').matches
}

export function resolveHeaderLayout({
  commandButtonWidth,
  desktopControlsWidth,
  gap = 16,
  keyboardCapable,
  logoWidth,
  containerWidth,
}: HeaderLayoutInput): HeaderLayout {
  const desktopRequired = logoWidth + desktopControlsWidth + gap
  const desktopWithCommandRequired =
    logoWidth + commandButtonWidth + desktopControlsWidth + gap * 2

  if (keyboardCapable && containerWidth >= desktopWithCommandRequired) {
    return {
      showCommandButton: true,
      showDesktopNav: true,
    }
  }

  if (containerWidth >= desktopRequired) {
    return {
      showCommandButton: false,
      showDesktopNav: true,
    }
  }

  return {
    showCommandButton: false,
    showDesktopNav: false,
  }
}
