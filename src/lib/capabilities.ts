/**
 * Runtime capability probe for Lab requirements.
 *
 * Entries declare what they need in frontmatter (`requires`); this answers
 * whether the visitor's browser actually provides it, before they try to run
 * anything. Detection is feature-based — never user-agent sniffing.
 *
 * Permission-gated capabilities (camera, microphone, clipboard, file access)
 * report `prompts` rather than `supported`: the API existing is not consent,
 * and claiming otherwise would misrepresent what happens on click.
 */
export type CapabilityState = 'supported' | 'missing' | 'prompts'

const has = (value: unknown): boolean => Boolean(value)

const probes: Record<string, () => CapabilityState> = {
  webgpu: () => (has('gpu' in navigator) ? 'supported' : 'missing'),
  webgl: () => {
    try {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
      return context ? 'supported' : 'missing'
    } catch {
      return 'missing'
    }
  },
  wasm: () => (typeof WebAssembly === 'object' ? 'supported' : 'missing'),
  simd: () => {
    // The shortest module whose validation requires SIMD support.
    try {
      return WebAssembly.validate(
        new Uint8Array([
          0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10,
          10, 1, 8, 0, 65, 0, 253, 15, 253, 98, 11,
        ]),
      )
        ? 'supported'
        : 'missing'
    } catch {
      return 'missing'
    }
  },
  threads: () =>
    has(
      typeof Worker !== 'undefined' && typeof SharedArrayBuffer !== 'undefined',
    )
      ? 'supported'
      : 'missing',
  'shared-array-buffer': () =>
    has(typeof SharedArrayBuffer !== 'undefined' && self.crossOriginIsolated)
      ? 'supported'
      : 'missing',
  camera: () =>
    has(navigator.mediaDevices?.getUserMedia) ? 'prompts' : 'missing',
  microphone: () =>
    has(navigator.mediaDevices?.getUserMedia) ? 'prompts' : 'missing',
  clipboard: () => (has(navigator.clipboard) ? 'prompts' : 'missing'),
  'file-system': () =>
    has('showOpenFilePicker' in window || 'FileReader' in window)
      ? 'prompts'
      : 'missing',
  storage: () => {
    try {
      const key = '__lab_probe__'
      localStorage.setItem(key, '1')
      localStorage.removeItem(key)
      return 'supported'
    } catch {
      return 'missing'
    }
  },
  network: () =>
    navigator.onLine === false ? 'missing' : ('supported' as CapabilityState),
}

export const probeCapabilities = (capability: string): CapabilityState =>
  probes[capability]?.() ?? 'supported'
