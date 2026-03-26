const HEADER_COMMAND_MIN_WIDTH = 560

export function isKeyboardCapableDevice() {
  if (
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function'
  ) {
    return true
  }

  return window.matchMedia('(any-hover: hover) and (any-pointer: fine)').matches
}

export function canShowHeaderCommandPalette(viewportWidth?: number) {
  const width =
    viewportWidth ??
    (typeof window !== 'undefined'
      ? window.innerWidth
      : HEADER_COMMAND_MIN_WIDTH)

  return isKeyboardCapableDevice() && width >= HEADER_COMMAND_MIN_WIDTH
}
