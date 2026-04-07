"use client";

import { useState, useMemo } from "react";
import { Search, Filter, Trash2, Clock, Users, Shield, Target, Globe, BookOpen } from "lucide-react";
import { useApp } from "@/context/AppContext";
import ImpactBadge from "@/components/shared/ImpactBadge";
import EmptyState from "@/components/shared/EmptyState";
import { getRelativeTime } from "@/lib/utils";
import type { ImpactCategory, ImpactMetrics } from "@/lib/types";

const CATEGORIES: ImpactCategory[] = [
  "Cost Avoidance",
  "Revenue Impact",
  "Efficiency Gain",
  "Risk Reduction",
  "Customer Satisfaction",
  "Team Enablement",
  "Knowledge Building",
];

const METRIC_ICONS: { key: keyof ImpactMetrics; icon: React.ElementType; color: string }[] = [
  { key: "timeSaved", icon: Clock, color: "#2563EB" },
  { key: "peopleUnblocked", icon: Users, color: "#7C3AED" },
  { key: "riskPrevented", icon: Shield, color: "#EF4444" },
  { key: "scopeOfWork", icon: Target, color: "#D97706" },
  { key: "reliabilitySignal", icon: Globe, color: "#0891B2" },
  { key: "knowledgeCreated", icon: BookOpen, color: "#16A34A" },
];

export default function HistoryPage() {
  const { tasks, removeTask } = useApp();
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    return tasks.filter((entry) => {
      const matchesSearch =
        !search ||
        entry.task.description.toLowerCase().includes(search.toLowerCase()) ||
        entry.analysis.headline.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        filterCategory === "All" ||
        entry.analysis.impactCategory === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [tasks, search, filterCategory]);

  return (
    <div className="space-y-5">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Tasks", value: tasks.length.toString() },
          { label: "Senior Time Saved", value: "~18 hrs" },
          { label: "Showing", value: `${filtered.length} tasks` },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <p className="text-lg font-bold text-[#2563EB]">{s.value}</p>
            <p className="text-xs text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#2563EB] bg-gray-50"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          {["All", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                filterCategory === cat
                  ? "bg-[#2563EB] text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Task list */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No tasks match your filters"
          description="Try changing your search or filter."
          actionLabel="Log a Task"
          actionHref="/log"
        />
      ) : (
        <div className="space-y-3">
          {filtered.map(({ task, analysis }) => {
            const metrics = analysis.impactMetrics ?? {};
            const topMetrics = METRIC_ICONS.filter(
              (m) => metrics[m.key] != null && metrics[m.key] !== ""
            ).slice(0, 2);

            return (
              <div
                key={task.id}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:border-[#BFDBFE] transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-xs text-gray-400">
                        {getRelativeTime(task.timestamp)}
                      </span>
                      <ImpactBadge category={analysis.impactCategory} size="sm" />
                    </div>

                    <h3 className="text-sm font-semibold text-[#0F172A] mb-1">
                      {analysis.headline}
                    </h3>
                    <p className="text-xs text-gray-400 mb-3">{task.description}</p>

                    {/* Top 2 impact metrics */}
                    {topMetrics.length > 0 && (
                      <div className="flex flex-col gap-1.5 mb-3">
                        {topMetrics.map(({ key, icon: Icon, color }) => (
                          <div key={key} className="flex items-start gap-2">
                            <Icon className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color }} />
                            <span className="text-xs text-gray-600 leading-snug">
                              {metrics[key]}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.skillsDemonstrated.map((skill) => (
                        <span
                          key={skill}
                          className="text-xs px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      onClick={() => removeTask(task.id)}
                      className="p-1.5 text-gray-300 hover:text-red-400 transition-colors rounded-lg hover:bg-red-50"
                      title="Remove task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Estimated value footnote */}
                <p className="text-xs text-gray-300 mt-3 pt-3 border-t border-gray-50">
                  Est. financial impact: {analysis.estimatedValue}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
