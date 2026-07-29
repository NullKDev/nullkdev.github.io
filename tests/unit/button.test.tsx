import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Button, buttonVariants } from '@ui/button'

afterEach(cleanup)

describe('Button', () => {
  it('renders a safe native button with the default variant', () => {
    render(<Button>Observe signal</Button>)

    const button = screen.getByRole('button', { name: 'Observe signal' })
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('data-slot', 'button')
    expect(button).toHaveClass('bg-[var(--action)]')
  })

  it('supports typed variants and merges conflicting utility classes', () => {
    render(
      <Button variant="outline" size="sm" className="min-h-14">
        Calibrate
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Calibrate' })
    expect(button).toHaveClass('bg-transparent', 'min-h-14')
    expect(button).not.toHaveClass('min-h-9')
    expect(buttonVariants({ variant: 'quiet' })).toContain(
      'text-[var(--ink-muted)]',
    )
  })

  it('preserves native disabled semantics and blocks activation', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(
      <Button disabled onClick={onClick}>
        Disabled action
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Disabled action' })
    expect(button).toBeDisabled()
    await user.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('composes an accessible link through asChild without an extra button', () => {
    render(
      <Button asChild variant="outline">
        <a href="/work">Explore Work</a>
      </Button>,
    )

    const link = screen.getByRole('link', { name: 'Explore Work' })
    expect(link).toHaveAttribute('href', '/work')
    expect(link).toHaveAttribute('data-slot', 'button')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('exposes disabled semantics and blocks composed link navigation', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(
      <Button asChild disabled>
        <a href="/work" onClick={onClick}>
          Unavailable Work
        </a>
      </Button>,
    )

    const link = screen.getByRole('link', { name: 'Unavailable Work' })
    expect(link).toHaveAttribute('aria-disabled', 'true')
    expect(link).toHaveAttribute('tabindex', '-1')
    expect(link).not.toHaveAttribute('disabled')
    await user.click(link)
    expect(onClick).not.toHaveBeenCalled()
  })
})
