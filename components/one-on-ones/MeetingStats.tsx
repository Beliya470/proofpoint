"use client";

import { Calendar, Target, CheckSquare, TrendingUp } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { MOCK_ONE_ON_ONE_STATS } from "@/lib/mock-data";

export default function MeetingStats() {
  const { meetings } = useApp();
  const s = MOCK_ONE_ON_ONE_STATS;

  const allGoals = meetings.flatMap((m) => m.goalsSet);
  const completedGoals = allGoals.filter((g) => g.status === "Completed").length;
  const completionPct = allGoals.length > 0
    ? Math.round((completedGoals / allGoals.length) * 100)
    : 0;

  const allActions = meetings.flatMap((m) => m.actionItems);
  const pendingActions = allActions.filter(
    (a) => a.status === "Pending" || a.status === "Overdue"
  );
  const overdueCount = pendingActions.filter((a) => a.status === "Overdue").length;

  const nextMeeting = s.nextScheduledMeeting
    ? new Date(s.nextScheduledMeeting)
    : null;
  const daysUntil = nextMeeting
    ? Math.ceil((nextMeeting.getTime() - Date.now()) / 86400000)
    : null;

  const cards = [
    {
      label: "1:1s Held",
      value: meetings.length.toString(),
      sub: s.averageMeetingFrequency,
      icon: Calendar,
      color: "#2563EB",
      bg: "#EFF6FF",
    },
    {
      label: "Goals",
      value: `${completedGoals}/${allGoals.length}`,
      sub: `${completionPct}% complete`,
      icon: Target,
      color: "#10B981",
      bg: "#DCFCE7",
    },
    {
      label: "Action Items",
      value: pendingActions.length.toString(),
      sub: overdueCount > 0 ? `${overdueCount} overdue` : "pending",
      icon: CheckSquare,
      color: overdueCount > 0 ? "#EF4444" : "#F59E0B",
      bg: overdueCount > 0 ? "#FEE2E2" : "#FEF3C7",
    },
    {
      label: "Next 1:1",
      value: daysUntil !== null ? (daysUntil === 0 ? "Today" : `In ${daysUntil}d`) : "Not set",
      sub: nextMeeting
        ? nextMeeting.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        : "Schedule one",
      icon: TrendingUp,
      color: "#7C3AED",
      bg: "#EDE9FE",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
        >
          <div className="flex items-start justify-between mb-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: card.bg }}
            >
              <card.icon className="w-5 h-5" style={{ color: card.color }} />
            </div>
          </div>
          <div className="text-2xl font-bold mb-0.5" style={{ color: card.color }}>
            {card.value}
          </div>
          <div className="text-xs text-gray-500">{card.label}</div>
          <div className="text-xs text-gray-400">{card.sub}</div>
        </div>
      ))}
    </div>
  );
}
