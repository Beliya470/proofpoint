"use client";

import { Lightbulb, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";

export default function InsightsSummary() {
  const { meetings } = useApp();

  // Derive real insights from actual data
  const allGoals = meetings.flatMap((m) => m.goalsSet);
  const allActions = meetings.flatMap((m) => m.actionItems);
  const overdueTL = allActions.filter(
    (a) => a.owner === "Team Lead" && a.status === "Overdue"
  );
  const completedGoals = allGoals.filter((g) => g.status === "Completed").length;
  const totalGoals = allGoals.length;

  // Collect AI insights from the last 2 meetings
  const insights: string[] = [];
  meetings.slice(0, 2).forEach((m) => insights.push(...m.aiInsights));

  // Add computed insights
  if (overdueTL.length > 0) {
    insights.push(
      `Your team lead has ${overdueTL.length} overdue action item${overdueTL.length > 1 ? "s" : ""} from recent 1:1s. A polite follow-up signals that you track commitments.`
    );
  }
  if (totalGoals > 0 && completedGoals / totalGoals >= 0.6) {
    insights.push(
      `You've completed ${completedGoals} out of ${totalGoals} goals — a ${Math.round((completedGoals / totalGoals) * 100)}% rate. That's strong follow-through. Document this in your next Context Bridge report.`
    );
  }

  const displayInsights = insights.slice(0, 4);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-[#F59E0B]" />
        </div>
        <h3 className="text-sm font-semibold text-[#0F172A]">
          Patterns ProofPoint Has Noticed
        </h3>
      </div>

      {displayInsights.length === 0 ? (
        <p className="text-sm text-gray-400">
          Log more 1:1s to unlock pattern insights across your meetings.
        </p>
      ) : (
        <div className="space-y-3">
          {displayInsights.map((insight, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-gray-600 leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-3">
        <Link
          href="/advocacy-coach"
          className="flex items-center gap-1.5 text-xs text-[#2563EB] hover:text-[#2563EB] font-medium transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          Practice with Advocacy Coach
        </Link>
        <Link
          href="/context-bridge"
          className="flex items-center gap-1.5 text-xs text-[#2563EB] hover:text-[#2563EB] font-medium transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          Generate Context Report
        </Link>
      </div>
    </div>
  );
}
