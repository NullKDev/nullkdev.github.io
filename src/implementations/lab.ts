export interface LabImplementation {
  component: string
  framework: 'astro' | 'react'
  hydration?: 'load' | 'idle' | 'visible' | 'media' | 'only'
  reason?: string
}

export const labImplementations = {
  'android-migration-planner': {
    component: '@/components/lab/AndroidMigrationPlanner.astro',
    framework: 'react',
    hydration: 'idle',
    reason:
      'The plan is built from the Android version notes at build time and server-rendered; the island adds the range picker, ticks, filters, the manifest check and export, all in the browser.',
  },
} satisfies Record<string, LabImplementation>
