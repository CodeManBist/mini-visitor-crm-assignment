import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        success:
          "border-green-500/20 bg-green-500/10 text-green-400",

        danger:
          "border-red-500/20 bg-red-500/10 text-red-400",

        warning:
          "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",

        info:
          "border-indigo-500/20 bg-indigo-500/10 text-indigo-400",

        secondary:
          "border-zinc-700 bg-zinc-800 text-zinc-300",
      },
    },

    defaultVariants: {
      variant: "secondary",
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({
  className,
  variant,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}