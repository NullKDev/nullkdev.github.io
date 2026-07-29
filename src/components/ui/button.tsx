import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cn } from '@lib/utils'

export const buttonVariants = cva(
  'inline-flex min-h-11 items-center justify-center gap-2 border px-4 font-mono text-xs font-semibold tracking-[0.08em] uppercase transition-[background-color,border-color,color,box-shadow,transform] duration-150 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45 data-[disabled]:pointer-events-none data-[disabled]:opacity-45',
  {
    variants: {
      variant: {
        default:
          'border-[var(--action)] bg-[var(--action)] text-[var(--action-foreground)] shadow-[var(--shadow-action)] hover:-translate-y-px hover:bg-[var(--action-hover)]',
        outline:
          'border-[var(--line-strong)] bg-transparent text-[var(--ink)] hover:border-[var(--action)] hover:bg-[var(--surface-raised)]',
        quiet:
          'border-transparent bg-transparent text-[var(--ink-muted)] hover:border-[var(--line)] hover:text-[var(--ink)]',
      },
      size: {
        sm: 'min-h-9 px-3 text-[0.68rem]',
        default: 'min-h-11 px-4',
        icon: 'size-11 min-h-11 px-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({
  asChild = false,
  className,
  disabled,
  onClickCapture,
  size,
  tabIndex,
  type,
  variant,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : 'button'
  const isDisabledLink = asChild && disabled

  return (
    <Component
      data-slot="button"
      data-disabled={disabled ? '' : undefined}
      aria-disabled={isDisabledLink || undefined}
      className={cn(buttonVariants({ size, variant }), className)}
      disabled={asChild ? undefined : disabled}
      onClickCapture={
        isDisabledLink
          ? (event) => {
              event.preventDefault()
              event.stopPropagation()
            }
          : onClickCapture
      }
      tabIndex={isDisabledLink ? -1 : tabIndex}
      type={asChild ? undefined : (type ?? 'button')}
      {...props}
    />
  )
}
