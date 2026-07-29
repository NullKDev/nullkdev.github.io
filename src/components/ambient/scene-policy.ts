export type AmbientSceneMode = 'animated' | 'still' | 'paused' | 'fallback'

interface AmbientSceneCapabilities {
  webglAvailable: boolean
  reducedMotion: boolean
  isVisible: boolean
}

export const getAmbientSceneMode = ({
  webglAvailable,
  reducedMotion,
  isVisible,
}: AmbientSceneCapabilities): AmbientSceneMode => {
  if (!webglAvailable) return 'fallback'
  if (!isVisible) return 'paused'
  if (reducedMotion) return 'still'
  return 'animated'
}
