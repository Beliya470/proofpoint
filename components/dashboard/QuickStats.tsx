"use client";

import { TrendingUp, ClipboardList, Flame, Star } from "lucide-react";
import { MOCK_DASHBOARD_STATS } from "@/lib/mock-data";

export default function QuickStats() {

  const stats = MOCK_DASHBOARD_STATS;

  const topSkill = stats.topSkills[0]?.skill ?? "";
  const topSkillShort = topSkill.includes("Problem Solving")
    ? "Problem Solving"
    : topSkill.split(" ").slice(0, 2).join(" ");

  const cards = [
    {
      label: "Tasks Logged",
      value: stats.totalTasksLogged.toString(),
      sub: "this month",
      icon: ClipboardList,
      color: "#0F172A",
      iconColor: "#2563EB",
      bg: "#EFF6FF",
    },
    {
      label: "Senior Time Saved",
      value: stats.seniorTimeSaved,
      sub: "across your logged tasks",
      icon: TrendingUp,
      color: "#2563EB",
      iconColor: "#2563EB",
      bg: "#EFF6FF",
    },
    {
      label: "Day Streak",
      value: `${stats.currentStreak}`,
      sub: "days in a row",
      icon: Flame,
      color: "#0F172A",
      iconColor: "#F59E0B",
      bg: "#FEF3C7",
    },
    {
      label: "Top Skill",
      value: topSkillShort,
      sub: `${stats.topSkills[0]?.count} tasks`,
      icon: Star,
      color: "#0F172A",
      iconColor: "#7C3AED",
      bg: "#EDE9FE",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-sm"
        >
          <div className="flex items-start justify-between mb-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: card.bg }}
            >
              <card.icon className="w-5 h-5" style={{ color: card.iconColor }} />
            </div>
          </div>
          <div
            className="text-2xl font-bold mb-0.5 truncate"
            style={{ color: card.color }}
          >
            {card.value}
          </div>
          <div className="text-xs text-[#475569]">{card.label}</div>
          <div className="text-xs text-[#94A3B8]">{card.sub}</div>
        </div>
      ))}
    </div>
  );
}
