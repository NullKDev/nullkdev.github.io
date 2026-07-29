import { renderToString } from 'react-dom/server'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'

import LabWorkbench from '@/components/lab/LabWorkbench'

describe('LabWorkbench', () => {
  afterEach(cleanup)
  it('SSR disables destructive submission and explains the JavaScript requirement', () => {
    const html = renderToString(
      <LabWorkbench implementationId="json-formatter" locale="en" />,
    )

    expect(html).toContain('type="submit" disabled=""')
  })

  it('offers JSON operation and indentation controls', async () => {
    const user = userEvent.setup()
    render(<LabWorkbench implementationId="json-formatter" locale="en" />)

    await user.selectOptions(screen.getByLabelText('Operation'), 'minify')
    await user.click(screen.getByRole('button', { name: 'Run locally' }))

    expect(screen.getByLabelText('Output')).toHaveValue(
      '{"archive":{"public":true,"signals":3}}',
    )
    expect(screen.getByLabelText('Indentation')).toBeInTheDocument()
  })

  it('localizes operation, groups, errors, and states in Spanish', async () => {
    const user = userEvent.setup()
    render(<LabWorkbench implementationId="base64-encoder" locale="es" />)

    expect(screen.getByLabelText('Operación')).toBeInTheDocument()
    expect(
      screen.getByRole('option', { name: 'Decodificar' }),
    ).toBeInTheDocument()
    await user.selectOptions(screen.getByLabelText('Operación'), 'decode')
    await user.clear(screen.getByLabelText('Entrada'))
    await user.type(screen.getByLabelText('Entrada'), '%%%')
    await user.click(
      screen.getByRole('button', { name: 'Ejecutar localmente' }),
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Base64 no válido')
    expect(screen.queryByText('Invalid Base64')).not.toBeInTheDocument()
  })

  it('reports oversized input accessibly before producing output', async () => {
    const user = userEvent.setup()
    render(<LabWorkbench implementationId="json-formatter" locale="en" />)
    const input = screen.getByLabelText('Input')
    await user.clear(input)
    fireEvent.change(input, { target: { value: 'a'.repeat(65_537) } })
    await user.click(screen.getByRole('button', { name: 'Run locally' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Input is too large')
    expect(screen.getByLabelText('Output')).toHaveValue('')
  })
})
