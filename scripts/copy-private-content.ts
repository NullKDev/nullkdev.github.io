import { cp, mkdir, rm, stat } from 'node:fs/promises'
import { resolve } from 'node:path'

const projectRoot = resolve(import.meta.dirname, '..')
const source = resolve(projectRoot, '.generated', 'protected')
const target = resolve(projectRoot, 'dist', 'protected')
const exists = await stat(source).then(
  () => true,
  () => false,
)

await rm(target, { recursive: true, force: true })
if (exists) {
  await mkdir(target, { recursive: true })
  await cp(source, target, { recursive: true })
}
