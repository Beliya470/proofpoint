"use client";

import { CheckCircle2, Circle, AlertCircle, XCircle, User, Users } from "lucide-react";
import type { ActionItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<ActionItem["status"], { icon: React.ElementType; color: string; bg: string }> = {
  Pending: { icon: Circle, color: "#F59E0B", bg: "#FEF3C7" },
  Done: { icon: CheckCircle2, color: "#10B981", bg: "#DCFCE7" },
  Overdue: { icon: AlertCircle, color: "#EF4444", bg: "#FEE2E2" },
  Cancelled: { icon: XCircle, color: "#9CA3AF", bg: "#F3F4F6" },
};

interface ActionItemsProps {
  items: ActionItem[];
  onToggle?: (id: string) => void;
}

export default function ActionItems({ items, onToggle }: ActionItemsProps) {
  if (items.length === 0) {
    return <p className="text-xs text-gray-400 italic">No action items from this meeting.</p>;
  }

  const sorted = [...items].sort((a, b) => {
    const order = { Overdue: 0, Pending: 1, Done: 2, Cancelled: 3 };
    return order[a.status] - order[b.status];
  });

  return (
    <div className="space-y-2">
      {sorted.map((item) => {
        const config = STATUS_CONFIG[item.status];
        const Icon = config.icon;
        const isDone = item.status === "Done" || item.status === "Cancelled";
        const dueDate = item.dueDate
          ? new Date(item.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
          : null;

        return (
          <div
            key={item.id}
            className={cn(
              "flex items-start gap-3 p-3 rounded-xl border transition-all",
              item.status === "Overdue"
                ? "border-red-200 bg-red-50"
                : item.status === "Done"
                ? "border-green-100 bg-green-50/50"
                : "border-gray-100 bg-white"
            )}
          >
            <button
              onClick={() => onToggle?.(item.id)}
              className="mt-0.5 shrink-0"
              disabled={!onToggle}
            >
              <Icon className="w-4 h-4" style={{ color: config.color }} />
            </button>

            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  "text-sm text-[#0F172A]",
                  isDone && "line-through text-gray-400"
                )}
              >
                {item.description}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  {item.owner === "Self" ? (
                    <User className="w-3 h-3" />
                  ) : (
                    <Users className="w-3 h-3" />
                  )}
                  {item.owner === "Self" ? "You" : "Team Lead"}
                </span>
                {dueDate && (
                  <span
                    className={cn(
                      "text-xs",
                      item.status === "Overdue" ? "text-red-500 font-medium" : "text-gray-400"
                    )}
                  >
                    · Due {dueDate}
                    {item.status === "Overdue" && " (overdue)"}
                  </span>
                )}
              </div>
            </div>

            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
              style={{ backgroundColor: config.bg, color: config.color }}
            >
              {item.status}
            </span>
          </div>
        );
      })}
    </div>
  );
}
