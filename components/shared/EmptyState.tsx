import Link from "next/link";
import { PlusCircle } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  title = "Nothing here yet",
  description = "Log your first task to get started.",
  actionLabel = "Log a Task",
  actionHref = "/log",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
      <div className="w-14 h-14 rounded-2xl bg-[#DBEAFE] flex items-center justify-center">
        <PlusCircle className="w-7 h-7 text-[#2563EB]" />
      </div>
      <h3 className="font-semibold text-[#0F172A]">{title}</h3>
      <p className="text-gray-400 text-sm max-w-xs">{description}</p>
      {actionHref && (
        <Link
          href={actionHref}
          className="mt-2 inline-flex items-center gap-2 bg-[#2563EB] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#2563EB] transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
