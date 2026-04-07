"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useApp } from "@/context/AppContext";
import ImpactBadge from "@/components/shared/ImpactBadge";
import EmptyState from "@/components/shared/EmptyState";
import { getRelativeTime } from "@/lib/utils";

export default function RecentTasks() {
  const { tasks } = useApp();
  const recent = tasks.slice(0, 5);

  return (
    <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-[#0F172A] text-sm">
            Recent Tasks
          </h3>
          <p className="text-[#94A3B8] text-xs mt-0.5">Your latest logged work</p>
        </div>
        <Link
          href="/history"
          className="text-xs text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 font-medium transition-colors"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {recent.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          description="Log your first task to see it here."
        />
      ) : (
        <div className="space-y-3">
          {recent.map(({ task, analysis }) => (
            <div
              key={task.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#F1F5F9] transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#94A3B8] mb-0.5">
                  {getRelativeTime(task.timestamp)}
                </p>
                <p className="text-sm font-medium text-[#0F172A] line-clamp-1">
                  {analysis.headline}
                </p>
                <p className="text-xs text-[#94A3B8] mt-0.5 line-clamp-1">
                  {task.description}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <ImpactBadge category={analysis.impactCategory} size="sm" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
