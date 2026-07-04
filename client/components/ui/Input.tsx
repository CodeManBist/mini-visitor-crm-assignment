"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      error,
      leftIcon,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const isPassword = type === "password";

    return (
      <div className="w-full space-y-2">

        {label && (
          <label className="text-sm font-medium text-[var(--foreground)]/80">
            {label}
          </label>
        )}

        <div
          className={cn(
            "relative flex h-12 items-center rounded-xl border bg-[var(--card)] transition-all duration-200",
            error
              ? "border-[var(--danger)]"
              : "border-[var(--border)] focus-within:border-[var(--primary)]",
            "focus-within:ring-2 focus-within:ring-[color-mix(in_srgb,var(--primary),transparent_80%)]"
          )}
        >
          {leftIcon && (
            <div className="ml-4 text-[var(--foreground)]/55">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            type={
              isPassword
                ? showPassword
                  ? "text"
                  : "password"
                : type
            }
            className={cn(
              "h-full w-full bg-transparent px-4 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--foreground)]/45",
              leftIcon && "pl-3",
              isPassword && "pr-12",
              className
            )}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="mr-4 text-[var(--foreground)]/55 transition hover:text-[var(--foreground)]"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          )}
        </div>

        {error && (
          <p className="text-sm text-[var(--danger)]">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;