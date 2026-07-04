"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
  {
    variants: {
      variant: {
        primary:
          "border border-transparent bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-lg shadow-indigo-600/20",

        secondary:
          "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--card-hover)]",

        outline:
          "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--card-hover)]",

        ghost:
          "text-[var(--foreground)]/65 hover:bg-[var(--card-hover)] hover:text-[var(--foreground)]",

        danger:
          "border border-transparent bg-[var(--danger)] text-white hover:brightness-95",
      },

      size: {
        sm: "h-9 px-4 text-sm",

        md: "h-11 px-5",

        lg: "h-12 px-6 text-base",

        icon: "h-10 w-10",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}

        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };