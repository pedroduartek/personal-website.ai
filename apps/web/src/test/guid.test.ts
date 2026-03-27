import { afterEach, describe, expect, it, vi } from 'vitest'
import { generateGuid } from '../utils/guid'

const originalRandomUuid = Object.getOwnPropertyDescriptor(
  globalThis.crypto,
  'randomUUID',
)
const originalGetRandomValues = Object.getOwnPropertyDescriptor(
  globalThis.crypto,
  'getRandomValues',
)

function restoreCryptoMethod(
  key: 'randomUUID' | 'getRandomValues',
  descriptor?: PropertyDescriptor,
) {
  if (descriptor) {
    Object.defineProperty(globalThis.crypto, key, descriptor)
    return
  }

  Reflect.deleteProperty(globalThis.crypto, key)
}

describe('generateGuid', () => {
  afterEach(() => {
    restoreCryptoMethod('randomUUID', originalRandomUuid)
    restoreCryptoMethod('getRandomValues', originalGetRandomValues)
    vi.restoreAllMocks()
  })

  it('uses crypto.randomUUID when available', () => {
    Object.defineProperty(globalThis.crypto, 'randomUUID', {
      configurable: true,
      value: vi.fn(() => '11111111-1111-4111-8111-111111111111'),
    })

    expect(generateGuid()).toBe('11111111-1111-4111-8111-111111111111')
  })

  it('builds a v4 GUID from crypto.getRandomValues when randomUUID is unavailable', () => {
    Object.defineProperty(globalThis.crypto, 'randomUUID', {
      configurable: true,
      value: undefined,
    })
    Object.defineProperty(globalThis.crypto, 'getRandomValues', {
      configurable: true,
      value: vi.fn((bytes: Uint8Array) => {
        bytes.set([
          0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a,
          0x0b, 0x0c, 0x0d, 0x0e, 0x0f,
        ])
        return bytes
      }),
    })

    expect(generateGuid()).toBe('00010203-0405-4607-8809-0a0b0c0d0e0f')
  })

  it('falls back to Math.random when crypto UUID helpers are unavailable', () => {
    Object.defineProperty(globalThis.crypto, 'randomUUID', {
      configurable: true,
      value: undefined,
    })
    Object.defineProperty(globalThis.crypto, 'getRandomValues', {
      configurable: true,
      value: undefined,
    })
    vi.spyOn(Math, 'random').mockReturnValue(0)

    expect(generateGuid()).toBe('00000000-0000-4000-8000-000000000000')
  })
})
