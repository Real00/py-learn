import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)] disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        primary: 'bg-[color:var(--color-primary)] text-[color:var(--color-primary-foreground)] shadow-sm hover:brightness-105',
        secondary: 'border border-[color:var(--color-border)] bg-white text-[color:var(--color-foreground)] shadow-sm hover:bg-[color:var(--color-secondary)]',
        ghost: 'bg-transparent text-[color:var(--color-muted-foreground)] hover:bg-[color:var(--color-secondary)]',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3 text-xs',
        lg: 'h-11 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
)
