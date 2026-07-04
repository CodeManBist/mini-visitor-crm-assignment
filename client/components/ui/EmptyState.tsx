import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
}

export default function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">

      <div className="mb-4 rounded-full bg-zinc-800 p-5">

        <Inbox className="h-10 w-10 text-zinc-500" />

      </div>

      <h3 className="text-lg font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 max-w-sm text-sm text-zinc-400">
        {description}
      </p>

    </div>
  );
}