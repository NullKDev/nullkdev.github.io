import { rename, rm } from 'node:fs/promises'
import { resolve } from 'node:path'

import { NodeIO } from '@gltf-transform/core'
import { KHRONOS_EXTENSIONS } from '@gltf-transform/extensions'
import {
  dedup,
  prune,
  quantize,
  resample,
  weld,
} from '@gltf-transform/functions'

const ALLOWED_ANIMATIONS = [
  'Dance',
  'Death',
  'Idle',
  'Jump',
  'No',
  'Running',
  'ThumbsUp',
  'Walking',
  'WalkJump',
  'Wave',
  'Yes',
] as const
const REMOVED_ANIMATIONS = new Set(['Punch', 'Sitting', 'Standing'])
const ACTION_INDIGO = '#4f46e5'

const srgbChannelToLinear = (channel: number) => {
  const value = channel / 255
  return value <= 0.04045
    ? value / 12.92
    : Math.pow((value + 0.055) / 1.055, 2.4)
}

const hexToLinearFactor = (hex: string): [number, number, number, number] => {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)
    ?.map((channel) => Number.parseInt(channel, 16))
  if (!channels || channels.length !== 3)
    throw new Error(`Invalid color: ${hex}`)
  return [
    srgbChannelToLinear(channels[0]),
    srgbChannelToLinear(channels[1]),
    srgbChannelToLinear(channels[2]),
    1,
  ]
}

const getAnimationDurations = (document: Awaited<ReturnType<NodeIO['read']>>) =>
  new Map(
    document
      .getRoot()
      .listAnimations()
      .map((animation) => [
        animation.getName(),
        Math.max(
          ...animation
            .listSamplers()
            .map((sampler) => sampler.getInput()?.getMax([])[0] ?? 0),
        ),
      ]),
  )

const getMorphTargetCount = (document: Awaited<ReturnType<NodeIO['read']>>) =>
  document
    .getRoot()
    .listMeshes()
    .reduce(
      (total, mesh) =>
        total +
        mesh
          .listPrimitives()
          .reduce(
            (count, primitive) => count + primitive.listTargets().length,
            0,
          ),
      0,
    )

const inputPath = resolve(
  process.argv[2] ?? 'assets/models/RobotExpressive.source.glb',
)
const outputPath = resolve(
  process.argv[3] ?? 'public/models/RobotExpressive.glb',
)
if (inputPath === outputPath) {
  throw new Error('Source and optimized RobotExpressive paths must differ')
}
const temporaryPath = `${outputPath}.tmp.glb`
const io = new NodeIO().registerExtensions(KHRONOS_EXTENSIONS)
const document = await io.read(inputPath)
const root = document.getRoot()
const sourceDurations = getAnimationDurations(document)
const sourceSkinCount = root.listSkins().length
const sourceMorphTargetCount = getMorphTargetCount(document)

for (const animation of root.listAnimations()) {
  const name = animation.getName()
  if (REMOVED_ANIMATIONS.has(name)) animation.dispose()
  else if (
    !ALLOWED_ANIMATIONS.includes(name as (typeof ALLOWED_ANIMATIONS)[number])
  ) {
    throw new Error(`Unexpected RobotExpressive animation: ${name}`)
  }
}

const mainMaterial = root
  .listMaterials()
  .find((material) => material.getName() === 'Main')
if (!mainMaterial)
  throw new Error('RobotExpressive material "Main" was not found')
mainMaterial.setBaseColorFactor(hexToLinearFactor(ACTION_INDIGO))

await document.transform(
  resample({ tolerance: 1e-4 }),
  dedup(),
  weld(),
  quantize({
    quantizePosition: 14,
    quantizeNormal: 10,
    quantizeTexcoord: 12,
    quantizeColor: 8,
    quantizeWeight: 12,
    quantizeGeneric: 12,
    normalizeWeights: true,
  }),
  prune(),
)

const finalAnimations = root
  .listAnimations()
  .map((animation) => animation.getName())
if (finalAnimations.join('\n') !== ALLOWED_ANIMATIONS.join('\n')) {
  throw new Error(
    `Unexpected final animation list: ${finalAnimations.join(', ')}`,
  )
}
if (root.listSkins().length !== sourceSkinCount) {
  throw new Error('Optimization changed the RobotExpressive skin count')
}
if (getMorphTargetCount(document) !== sourceMorphTargetCount) {
  throw new Error('Optimization changed the RobotExpressive morph target count')
}

const finalDurations = getAnimationDurations(document)
for (const animation of ALLOWED_ANIMATIONS) {
  const before = sourceDurations.get(animation)
  const after = finalDurations.get(animation)
  if (before == null || after == null || Math.abs(before - after) > 1e-6) {
    throw new Error(`${animation} duration changed from ${before} to ${after}`)
  }
}

try {
  await io.write(temporaryPath, document)
  await rename(temporaryPath, outputPath)
} finally {
  await rm(temporaryPath, { force: true })
}

console.log(
  JSON.stringify(
    {
      input: inputPath,
      output: outputPath,
      animations: finalAnimations,
      material: {
        name: mainMaterial.getName(),
        baseColorFactor: mainMaterial.getBaseColorFactor(),
        sourceToken: ACTION_INDIGO,
      },
      skins: root.listSkins().length,
      morphTargets: getMorphTargetCount(document),
    },
    null,
    2,
  ),
)
