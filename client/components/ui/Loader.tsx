import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
}

export default function Loader({
  className,
}: LoaderProps) {
  return (
    <div
      className={cn(
        "h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent text-[var(--primary)]",
        className
      )}
    />
  );
}