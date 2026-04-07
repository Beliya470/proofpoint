"use client";

import { useState } from "react";
import { CheckSquare, Square, FileText, Calendar } from "lucide-react";
import { useApp } from "@/context/AppContext";
import ImpactBadge from "@/components/shared/ImpactBadge";
import { getRelativeTime } from "@/lib/utils";
import type { LoggedTaskEntry } from "@/lib/types";

interface ReportGeneratorProps {
  onGenerate: (tasks: LoggedTaskEntry[], period: string) => void;
  loading: boolean;
}

const PERIODS = [
  { value: "This Week", label: "This Week" },
  { value: "Last 2 Weeks", label: "Last 2 Weeks" },
  { value: "This Month", label: "This Month" },
];

export default function ReportGenerator({
  onGenerate,
  loading,
}: ReportGeneratorProps) {
  const { tasks } = useApp();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [period, setPeriod] = useState("This Week");

  const toggleTask = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    setSelected(new Set(tasks.map((t) => t.task.id)));
  };

  const clearAll = () => setSelected(new Set());

  const selectedTasks = tasks.filter((t) => selected.has(t.task.id));

  return (
    <div className="space-y-5">
      {/* Period selector */}
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-500 font-medium">Period:</span>
        <div className="flex gap-2">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                period === p.value
                  ? "bg-[#2563EB] text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task list */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <span className="text-xs font-semibold text-gray-500">
            {tasks.length} tasks available
          </span>
          <div className="flex gap-3">
            <button
              onClick={selectAll}
              className="text-xs text-[#2563EB] hover:text-[#2563EB] font-medium transition-colors"
            >
              Select All
            </button>
            <button
              onClick={clearAll}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
          {tasks.map(({ task, analysis }) => {
            const isSelected = selected.has(task.id);
            return (
              <button
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-[#F1F5F9] transition-colors ${
                  isSelected ? "bg-[#EFF6FF]" : ""
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-[#2563EB]" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 mb-0.5">
                    {getRelativeTime(task.timestamp)}
                  </p>
                  <p className="text-sm text-[#0F172A] line-clamp-1">
                    {analysis.headline}
                  </p>
                  <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                    {task.description}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                  <ImpactBadge category={analysis.impactCategory} size="sm" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Generate button */}
      {selected.size > 0 && (
        <div className="bg-[#F1F5F9] rounded-xl p-4 border border-[#BFDBFE] flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[#2563EB]">
              {selected.size} task{selected.size !== 1 ? "s" : ""} selected
            </p>
            <p className="text-xs text-gray-400">
              Ready to generate your impact report
            </p>
          </div>
          <button
            onClick={() => onGenerate(selectedTasks, period)}
            disabled={loading}
            className="flex items-center gap-2 bg-[#2563EB] text-white font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all text-sm shadow-sm"
          >
            <FileText className="w-4 h-4" />
            Generate Report
          </button>
        </div>
      )}
    </div>
  );
}
