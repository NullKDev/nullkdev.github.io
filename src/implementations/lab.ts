export interface LabImplementation {
  component: string
  framework: 'astro' | 'react'
  hydration?: 'load' | 'idle' | 'visible' | 'media' | 'only'
  reason?: string
}

const localReactTool: LabImplementation = {
  component: '@/components/lab/LabWorkbench',
  framework: 'react',
  hydration: 'idle',
  reason:
    'Stateful local transformations benefit from one shared, keyboard-accessible workspace.',
}

export const labImplementations = {
  'json-formatter': localReactTool,
  'yaml-validator': localReactTool,
  'base64-encoder': localReactTool,
  'password-generator': localReactTool,
  'subnet-calculator': localReactTool,
  'timestamp-converter': localReactTool,
  'docker-converter': localReactTool,
  'ascii-converter': localReactTool,
} satisfies Record<string, LabImplementation>
