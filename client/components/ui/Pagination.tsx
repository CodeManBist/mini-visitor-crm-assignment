import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/Button";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-4 border-t border-zinc-800 px-6 py-4 text-sm text-zinc-400">
      <p>
        Page {page} of {totalPages}
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          <ChevronLeft size={16} className="mr-1" />
          Previous
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        >
          Next
          <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
}